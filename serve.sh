#!/bin/bash
cd "$(dirname "$0")"
echo "🌐 Love at First Site — http://localhost:5174"
open "http://localhost:5174"
python3 -m http.server 5174
