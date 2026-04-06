#!/bin/bash

# BRD LoanCRM Deployment Guide PDF Generator

echo "🚀 Creating PDF version of BRD LoanCRM Deployment Guide..."

# Check if required tools are available
if command -v pandoc &> /dev/null; then
    echo "✅ Pandoc found"
    
    # Try different PDF engines
    if command -v pdflatex &> /dev/null; then
        echo "✅ pdflatex found - creating PDF with LaTeX engine..."
        pandoc BRD-LoanCRM-Deployment-Guide.md -o BRD-LoanCRM-Deployment-Guide.pdf --pdf-engine=pdflatex -V geometry:margin=1in -V fontsize=11pt
    elif command -v wkhtmltopdf &> /dev/null; then
        echo "✅ wkhtmltopdf found - creating PDF with wkhtmltopdf..."
        pandoc BRD-LoanCRM-Deployment-Guide.md -t html5 -o temp.html
        wkhtmltopdf --page-size A4 --margin-top 1in --margin-right 1in --margin-bottom 1in --margin-left 1in temp.html BRD-LoanCRM-Deployment-Guide.pdf
        rm temp.html
    elif command -v chromium &> /dev/null; then
        echo "✅ Chromium found - creating PDF with headless Chrome..."
        pandoc BRD-LoanCRM-Deployment-Guide.md -t html5 -o temp.html
        chromium --headless --disable-gpu --print-to-pdf=BRD-LoanCRM-Deployment-Guide.pdf --virtual-time-budget=1000 temp.html
        rm temp.html
    else
        echo "❌ No PDF engine found. Installing basic PDF generator..."
        
        # Install basic tools
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            sudo apt-get update
            sudo apt-get install -y pandoc texlive-latex-base wkhtmltopdf
        elif [[ "$OSTYPE" == "darwin"* ]]; then
            brew install pandoc wkhtmltopdf
        fi
        
        echo "✅ Tools installed. Creating PDF..."
        pandoc BRD-LoanCRM-Deployment-Guide.md -o BRD-LoanCRM-Deployment-Guide.pdf --pdf-engine=pdflatex -V geometry:margin=1in -V fontsize=11pt
    fi
    
elif command -v wkhtmltopdf &> /dev/null; then
    echo "✅ Using wkhtmltopdf directly..."
    # Convert to HTML first
    python3 -c "
import markdown
with open('BRD-LoanCRM-Deployment-Guide.md', 'r') as f:
    html = markdown.markdown(f.read(), extensions=['tables', 'toc'])
with open('temp.html', 'w') as f:
    f.write('''
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; margin: 1in; }
        h1 { color: #2c3e50; }
        h2 { color: #34495e; }
        h3 { color: #7f8c8d; }
        code { background: #f8f9fa; padding: 2px 4px; border-radius: 3px; }
        pre { background: #f8f9fa; padding: 10px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
''' + html + '''
</body>
</html>
''')
"
    wkhtmltopdf --page-size A4 --margin-top 1in --margin-right 1in --margin-bottom 1in --margin-left 1in temp.html BRD-LoanCRM-Deployment-Guide.pdf
    rm temp.html
    
else
    echo "❌ PDF generation tools not found."
    echo ""
    echo "📋 To install PDF generation tools:"
    echo ""
    echo "On Ubuntu/Debian:"
    echo "  sudo apt-get update"
    echo "  sudo apt-get install -y pandoc texlive-latex-base wkhtmltopdf"
    echo ""
    echo "On macOS:"
    echo "  brew install pandoc wkhtmltopdf"
    echo ""
    echo "On Windows:"
    echo "  1. Download and install Pandoc from https://pandoc.org/installing.html"
    echo "  2. Download and install wkhtmltopdf from https://wkhtmltopdf.org/downloads.html"
    echo ""
    echo "📄 Alternative: Use online Markdown to PDF converters"
    echo "   - https://md-to-pdf.fly.dev/"
    echo "   - https://dillinger.io/"
    echo "   - https://stackedit.io/"
    echo ""
    echo "📋 Or use the HTML version in any browser and print to PDF"
    exit 1
fi

# Check if PDF was created
if [ -f "BRD-LoanCRM-Deployment-Guide.pdf" ]; then
    echo "✅ PDF created successfully: BRD-LoanCRM-Deployment-Guide.pdf"
    echo "📁 File size: $(du -h BRD-LoanCRM-Deployment-Guide.pdf | cut -f1)"
    echo "📄 Ready for distribution!"
else
    echo "❌ PDF creation failed. Please check error messages above."
    exit 1
fi
