import unittest
from backend.app.core.security import get_password_hash, verify_password, create_access_token, decode_access_token


class TestAuth(unittest.TestCase):
    def test_password_hashing(self):
        password = "SecretPassword123!"
        hashed = get_password_hash(password)
        self.assertNotEqual(hashed, password)
        self.assertTrue(verify_password(password, hashed))
        self.assertFalse(verify_password("WrongPassword", hashed))

    def test_jwt_token_generation(self):
        user_id = "test-user-uuid-123"
        token = create_access_token(subject=user_id)
        self.assertIsInstance(token, str)
        
        payload = decode_access_token(token)
        self.assertIsNotNone(payload)
        self.assertEqual(payload.get("sub"), user_id)


if __name__ == "__main__":
    unittest.main()

