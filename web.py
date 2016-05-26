# coding: utf-8

from bs4 import BeautifulSoup
from os import curdir, sep
import SimpleHTTPServer
import BaseHTTPServer
import SocketServer
import re
import json
import requests

PORT = 7788


class MyRequestHandler(BaseHTTPServer.BaseHTTPRequestHandler):
	def parse(self, requestURL):
		r = requests.get(requestURL)
		soup = BeautifulSoup(r.text)
		returnObj = dict()
		returnObj['title'] = soup.find('h1', class_='headline').string
		returnObj['time'] = soup.find('abbr').string
		# returnObj['time'] = soup.select('abbr', class_='headline').string

		self.wfile.write(json.dumps(returnObj))
	def do_GET(self):
		
		if self.path.startswith('/queryNews/'):
			self.send_response(200)  # OK
			self.end_headers()
			if None != re.search('/queryNews/*', self.path):
 				requestURL = self.path.split('/queryNews/')[-1]
 			
			self.parse(requestURL)
			return
		elif self.path == '/':
			self.path = '/index.html'

		self.send_response(200)  # OK
		self.end_headers()
		f = open(curdir + sep + self.path, 'r') 
		self.wfile.write(f.read())

Handler = MyRequestHandler

httpd = SocketServer.TCPServer(("", PORT), Handler)

print "serving at port", PORT
httpd.serve_forever()

