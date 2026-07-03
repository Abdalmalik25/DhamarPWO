@echo off
chcp 65001 >nul
echo ========================================
echo   مكتب الأشغال العامة والطرق - ذمار
echo   خادم المعاينة المحلي
echo ========================================
echo.
echo بعد تشغيل هذا الملف، افتح المتصفح على:
echo   http://localhost:8888
echo.
pause

:: استخدام Python لإنشاء خادم HTTP بسيط
python -c "
import http.server
import socketserver
import os

os.chdir('dist')

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'SAMEORIGIN')
        self.send_header('X-XSS-Protection', '1; mode=block')
        super().end_headers()

with socketserver.TCPServer(('', 8888), Handler) as httpd:
    print('✓ الخادم يعمل على http://localhost:8888')
    print('✓ اضغط Ctrl+C للإيقاف')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\n✓ تم إيقاف الخادم')
        httpd.shutdown()
"