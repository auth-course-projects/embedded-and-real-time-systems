google-chrome http://localhost:8000/Timeline </dev/null >/dev/null 2>&1 & disown
cd .. && python -m SimpleHTTPServer
