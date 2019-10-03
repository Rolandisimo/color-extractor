import sys
from get_image_colors import findColors

# print(findColors("https://cdn.pixabay.com/photo/2018/10/30/16/06/water-lily-3784022__340.jpg"))
print(findColors(sys.argv[1]))

# from http.server import (
#   BaseHTTPRequestHandler,
#   HTTPServer
# )
# from urllib import parse

# class Server(BaseHTTPRequestHandler):
#   def _set_headers(self):
#     self.send_response(200)
#     self.send_header("Content-type", "text/html")
#     self.end_headers()

#   def create_html_color_block(self, color):
#     return f"""<div style="background-color: {color}; width: 1px; height: 20px"></div>""".format(color=color)

#   def create_html_color_container(self, url):
#     colors = findColors(url)
#     container_start = f"""<div style="display: flex; flex-wrap: nowrap;">"""
#     container_content = f""
#     container_end = f"</div>"
#     for color in colors:
#       container_content += self.create_html_color_block(color)

#     return container_start + container_content + container_end


#   def do_GET(self):
#     self._set_headers()
#     parsed_url = parse.urlparse(self.path)
#     queries = dict(parse.parse_qsl(parsed_url.query))
#     image_url = queries.get("url")

#     content = "No url provided!"
#     if image_url is not None:
#       content = self.create_html_color_container(image_url)

#     self.wfile.write(content.encode("utf8"))

#   def do_HEAD(self):
#     self._set_headers()

#   def do_POST(self):
#     # Doesn't do anything with posted data
#     self._set_headers()
#     self.wfile.write("")

# def run(server_class=HTTPServer, handler_class=Server):
#     server_address = ('', 8000)
#     httpd = server_class(server_address, handler_class)

#     httpd.serve_forever()

# run()

# print(findColors(url))


# with open("colors.txt", mode="w") as colors_file:
#   for color in colors:
#     colors_file.writelines("{}\n".format(color))
