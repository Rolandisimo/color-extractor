import numpy as np
from cv2 import ( imdecode, IMREAD_UNCHANGED )
import urllib
from urllib.request import ( Request, urlopen )
import webcolors
import time
import colorsys
import math
import sys

def requestObject(image_url):
  temp_req = { "status": 403 }
  retry_counter = 1
  req = Request(image_url, headers={'User-Agent': 'Mozilla/5.0'})
  res = None

  while((temp_req['status'] != 200) and (retry_counter <= 10)):
    try:
      res = urlopen(req)
      temp_req = { "status": 200 }
    except:
      time.sleep(4)
    retry_counter = retry_counter + 1

  return res

def getImageArray(image_url):
  req = requestObject(image_url)
  arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
  return imdecode(arr, IMREAD_UNCHANGED)

def bgr_to_rgb(bgr):
  rgb = list(bgr)
  rgb.reverse()
  return rgb

def rgb_to_hex(rgb):
  return webcolors.rgb_to_hex(rgb)

def findColors(url):
  imageColorsMatrix = getImageArray(url)

  colors_rgb = set()

  for matrix in imageColorsMatrix:
    for bgr in matrix:
      colors_rgb.add(tuple(bgr_to_rgb(bgr)))

  sorted_colors = list(colors_rgb)
  # sorted_colors.sort(key=lambda rgb: step(rgb))

  return list(map(lambda rgb: rgb_to_hex(rgb), sorted_colors))

def step(rgb, repetitions=1):
  r,g,b = rgb
  lum = math.sqrt( .241 * r + .691 * g + .068 * b )

  h, s, v = colorsys.rgb_to_hsv(r,g,b)

  h2 = int(h * repetitions)
  lum2 = int(lum * repetitions)
  v2 = int(v * repetitions)

  return (h2, lum2, v2)

# Printed out to a node child process
# Has to be the only stdout print
print(findColors(sys.argv[1]))
