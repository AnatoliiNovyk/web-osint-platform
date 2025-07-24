from flask import Flask, render_template, request, jsonify
import requests
import whois
import socket
import dns.resolver
from urllib.parse import urlparse
import re

app = Flask(__name__)

class OSINTTools:
    def __init__(self):
        self.api_keys = {
            # Добавьте ваши API ключи здесь
        }
    
    def domain_whois(self, domain):
        """Получение WHOIS информации о домене"""
        try:
            w = whois.whois(domain)
            return {
                'domain': domain,
                'registrar': w.registrar,
                'creation_date': str(w.creation_date) if w.creation_date else None,
                'expiration_date': str(w.expiration_date) if w.expiration_date else None,
                'name_servers': w.name_servers,
                'status': w.status
            }
        except Exception as e:
            return {'error': str(e)}
    
    def dns_lookup(self, domain, record_type='A'):
        """DNS lookup"""
        try:
            result = dns.resolver.resolve(domain, record_type)
            return [str(rdata) for rdata in result]
        except Exception as e:
            return {'error': str(e)}
    
    def reverse_dns(self, ip):
        """Reverse DNS lookup"""
        try:
            hostname = socket.gethostbyaddr(ip)[0]
            return hostname
        except Exception as e:
            return {'error': str(e)}
    
    def extract_emails(self, text):
        """Извлечение email адресов из текста"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        return re.findall(email_pattern, text)
    
    def extract_social_links(self, text):
        """Извлечение ссылок на социальные сети"""
        patterns = {
            'facebook': r'(?:https?:\/\/)?(?:www\.)?facebook\.com\/[A-Za-z0-9.]+',
            'twitter': r'(?:https?:\/\/)?(?:www\.)?twitter\.com\/[A-Za-z0-9_]+',
            'linkedin': r'(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[A-Za-z0-9\/\-]+',
            'instagram': r'(?:https?:\/\/)?(?:www\.)?instagram\.com\/[A-Za-z0-9_.]+'
        }
        
        results = {}
        for platform, pattern in patterns.items():
            matches = re.findall(pattern, text)
            if matches:
                results[platform] = matches
        return results

@app.route('/')
def index():
    return render_template('osint.html')

@app.route('/whois', methods=['POST'])
def whois_lookup():
    domain = request.json.get('domain')
    if not domain:
        return jsonify({'error': 'Domain is required'}), 400
    
    osint = OSINTTools()
    result = osint.domain_whois(domain)
    return jsonify(result)

@app.route('/dns', methods=['POST'])
def dns_lookup():
    domain = request.json.get('domain')
    record_type = request.json.get('type', 'A')
    
    if not domain:
        return jsonify({'error': 'Domain is required'}), 400
    
    osint = OSINTTools()
    result = osint.dns_lookup(domain, record_type)
    return jsonify({'records': result})

@app.route('/reverse_dns', methods=['POST'])
def reverse_dns_lookup():
    ip = request.json.get('ip')
    if not ip:
        return jsonify({'error': 'IP is required'}), 400
    
    osint = OSINTTools()
    result = osint.reverse_dns(ip)
    return jsonify({'hostname': result})

@app.route('/analyze_website', methods=['POST'])
def analyze_website():
    url = request.json.get('url')
    if not url:
        return jsonify({'error': 'URL is required'}), 400
    
    try:
        # Получаем содержимое сайта
        response = requests.get(url, timeout=10)
        content = response.text
        
        osint = OSINTTools()
        
        # Извлекаем информацию
        emails = osint.extract_emails(content)
        social_links = osint.extract_social_links(content)
        
        # Получаем домен
        parsed_url = urlparse(url)
        domain = parsed_url.netloc
        
        # WHOIS информация
        whois_info = osint.domain_whois(domain)
        
        # DNS информация
        a_records = osint.dns_lookup(domain, 'A')
        mx_records = osint.dns_lookup(domain, 'MX')
        
        return jsonify({
            'url': url,
            'emails': list(set(emails)),  # Убираем дубликаты
            'social_links': social_links,
            'whois': whois_info,
            'dns': {
                'A': a_records,
                'MX': mx_records
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
