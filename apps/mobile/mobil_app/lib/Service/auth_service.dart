import 'package:shared_preferences/shared_preferences.dart';
import 'api_service.dart';
import '../Model/user.dart';

class AuthService {
  static const String _tokenKey = 'auth_token';

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  static Future<void> setToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
  }

  static Future<void> removeToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
  }

  static Future<User?> register(String email, String password, String name, String firstName) async {
    final response = await ApiService.register(email, password, name, firstName);
    if (response.containsKey('token') && response.containsKey('user')) {
      await setToken(response['token']);
      return User.fromJson(response['user']);
    }
    return null;
  }

  static Future<User?> login(String email, String password) async {
    final response = await ApiService.login(email, password);
    if (response.containsKey('token') && response.containsKey('user')) {
      await setToken(response['token']);
      return User.fromJson(response['user']);
    }
    return null;
  }

  static Future<User?> getCurrentUser() async {
    final token = await getToken();
    if (token != null) {
      try {
        final userJson = await ApiService.getCurrentUser(token);
        return User.fromJson(userJson);
      } catch (e) {
        await removeToken();
      }
    }
    return null;
  }

  static Future<void> logout() async {
    await removeToken();
  }
}