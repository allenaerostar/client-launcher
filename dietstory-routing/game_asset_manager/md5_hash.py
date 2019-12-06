import hashlib

class LocalFileHash:
	CHUNK_SIZE = 8192

	def md5_hash(file):
		with open(file, "rb")as f:
			md5 = hashlib.md5()
			while True:
				data = f.read(LocalFileHash.CHUNK_SIZE)
				if not data:
					break
				md5.update(data)

			return md5.hexdigest()