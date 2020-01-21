import random
import string


class RandomPasswordGenerator:

    def __init__(self):
        self.password_length = 8
        self.password_characters = string.ascii_letters + string.digits + "-_"

    def generate(self):
        return ''.join(random.choice(self.password_characters) for i in range(self.password_length))


RandomPasswordGenerator = RandomPasswordGenerator()
