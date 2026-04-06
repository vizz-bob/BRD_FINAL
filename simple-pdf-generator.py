#!/usr/bin/env python3
"""
Simple PDF Generator for BRD LoanCRM Deployment Guide
Creates a nicely formatted PDF from the markdown file
"""

import markdown
import sys
import os

def create_html_pdf():
    """Create HTML version that can be printed to PDF"""
    
    # Read the markdown file
    try:
        with open('BRD-LoanCRM-Deployment-Guide.md', 'r', encoding='utf-8') as f:
            md_content = f.read()
    except FileNotFoundError:
        print("❌ BRD-LoanCRM-Deployment-Guide.md not found!")
        return False
    
    # Convert markdown to HTML
    try:
        html_content = markdown.markdown(md_content, extensions=['tables', 'toc', 'fenced_code'])
    except Exception as e:
        print(f"❌ Error converting markdown: {e}")
        return False
    
    # Create full HTML document
    full_html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BRD LoanCRM - Complete AWS Deployment Guide</title>
    <style>
        @page {{
            margin: 1in;
            size: A4;
        }}
        
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 100%;
            margin: 0;
            padding: 0;
            background: white;
        }}
        
        .container {{
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }}
        
        h1 {{
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
            page-break-before: always;
            margin-top: 40px;
        }}
        
        h2 {{
            color: #34495e;
            border-bottom: 2px solid #ecf0f1;
            padding-bottom: 5px;
            margin-top: 30px;
        }}
        
        h3 {{
            color: #7f8c8d;
            margin-top: 25px;
        }}
        
        h4 {{
            color: #95a5a6;
            margin-top: 20px;
        }}
        
        p {{
            margin-bottom: 15px;
            text-align: justify;
        }}
        
        ul, ol {{
            margin-bottom: 15px;
            padding-left: 20px;
        }}
        
        li {{
            margin-bottom: 5px;
        }}
        
        code {{
            background: #f8f9fa;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            border: 1px solid #e9ecef;
        }}
        
        pre {{
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            border: 1px solid #e9ecef;
            margin: 15px 0;
            page-break-inside: avoid;
        }}
        
        pre code {{
            background: none;
            padding: 0;
            border: none;
            font-size: 0.9em;
        }}
        
        blockquote {{
            border-left: 4px solid #3498db;
            padding-left: 15px;
            margin: 15px 0;
            color: #7f8c8d;
            font-style: italic;
        }}
        
        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            page-break-inside: avoid;
        }}
        
        th, td {{
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }}
        
        th {{
            background-color: #f2f2f2;
            font-weight: bold;
        }}
        
        .checklist {{
            list-style: none;
            padding-left: 0;
        }}
        
        .checklist li {{
            margin-bottom: 8px;
            position: relative;
            padding-left: 25px;
        }}
        
        .checklist li:before {{
            content: '☐';
            position: absolute;
            left: 0;
            font-weight: bold;
            color: #3498db;
        }}
        
        .checklist li.completed:before {{
            content: '☑';
            color: #27ae60;
        }}
        
        .header {{
            text-align: center;
            margin-bottom: 40px;
            page-break-after: always;
        }}
        
        .header h1 {{
            color: #2c3e50;
            border: none;
            font-size: 2.5em;
            margin-bottom: 10px;
        }}
        
        .header p {{
            color: #7f8c8d;
            font-size: 1.1em;
        }}
        
        .footer {{
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ecf0f1;
            text-align: center;
            color: #7f8c8d;
            font-size: 0.9em;
        }}
        
        .success {{
            color: #27ae60;
            font-weight: bold;
        }}
        
        .error {{
            color: #e74c3c;
            font-weight: bold;
        }}
        
        .warning {{
            color: #f39c12;
            font-weight: bold;
        }}
        
        @media print {{
            body {{
                font-size: 12pt;
            }}
            
            h1 {{
                page-break-before: always;
                margin-top: 20px;
            }}
            
            pre, table {{
                page-break-inside: avoid;
            }}
            
            .container {{
                max-width: 100%;
                padding: 0;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>BRD LoanCRM</h1>
            <p><strong>Complete AWS Deployment Guide</strong></p>
            <p>Version 1.0 | Last Updated: April 2026</p>
        </div>
        
        {html_content}
        
        <div class="footer">
            <p>© 2026 BRD LoanCRM - AWS Deployment Guide</p>
            <p>For support and updates, visit the project repository</p>
        </div>
    </div>
</body>
</html>
"""
    
    # Write HTML file
    try:
        with open('BRD-LoanCRM-Deployment-Guide.html', 'w', encoding='utf-8') as f:
            f.write(full_html)
        print("✅ HTML version created: BRD-LoanCRM-Deployment-Guide.html")
        return True
    except Exception as e:
        print(f"❌ Error creating HTML file: {e}")
        return False

def main():
    """Main function"""
    print("🚀 BRD LoanCRM PDF Generator")
    print("=" * 50)
    
    # Create HTML version
    if create_html_pdf():
        print("\n✅ HTML version created successfully!")
        print("\n📋 To create PDF:")
        print("1. Open BRD-LoanCRM-Deployment-Guide.html in any browser")
        print("2. Use Print function (Ctrl+P or Cmd+P)")
        print("3. Select 'Save as PDF' as destination")
        print("4. Choose 'A4' paper size and 'Portrait' orientation")
        print("5. Click 'Save'")
        
        print("\n🌐 Alternative PDF converters:")
        print("- Online: https://md-to-pdf.fly.dev/")
        print("- Online: https://dillinger.io/")
        print("- Online: https://stackedit.io/")
        
        print("\n📄 Files created:")
        print("- BRD-LoanCRM-Deployment-Guide.html (for PDF printing)")
        print("- BRD-LoanCRM-Deployment-Guide.md (original)")
        
        # Try to open in browser automatically
        try:
            import subprocess
            import webbrowser
            
            # Try different commands to open browser
            if sys.platform == "darwin":  # macOS
                subprocess.run(["open", "BRD-LoanCRM-Deployment-Guide.html"])
            elif sys.platform == "win32":  # Windows
                subprocess.run(["start", "BRD-LoanCRM-Deployment-Guide.html"], shell=True)
            elif sys.platform.startswith("linux"):  # Linux
                subprocess.run(["xdg-open", "BRD-LoanCRM-Deployment-Guide.html"])
            
            print("\n🌐 Opening HTML file in default browser...")
            
        except Exception as e:
            print(f"\n⚠️  Could not auto-open browser: {e}")
            print("Please open BRD-LoanCRM-Deployment-Guide.html manually")
        
        return True
    else:
        print("❌ Failed to create HTML version")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
