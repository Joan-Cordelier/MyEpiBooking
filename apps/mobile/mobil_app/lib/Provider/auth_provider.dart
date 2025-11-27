import 'package:flutter/material.dart';
import '../Model/user.dart';
import '../Service/auth_service.dart';

class AuthProvider with ChangeNotifier {
  User? _user;
  bool _isLoading = true;

  User? get user => _user;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _user != null;

  Future<void> checkAuth() async {
    _user = await AuthService.getCurrentUser();
    _isLoading = false;
    notifyListeners();
  }

  Future<void> login(String email, String password) async {
    _user = await AuthService.login(email, password);
    notifyListeners();
  }

  Future<void> logout() async {
    await AuthService.logout();
    _user = null;
    notifyListeners();
  }
}