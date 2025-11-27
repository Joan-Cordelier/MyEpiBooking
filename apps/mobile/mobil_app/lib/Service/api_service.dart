import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'http://10.0.2.2:3001'; // URL du backend (10.0.2.2 pour émulateur Android)

  // Méthode pour récupérer toutes les salles
  static Future<List<dynamic>> fetchRooms() async {
    final response = await http.get(Uri.parse('$baseUrl/api/rooms'));

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load rooms');
    }
  }

  // Méthode de connexion
  static Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to login');
    }
  }

  // Méthode pour récupérer l'utilisateur actuel
  static Future<Map<String, dynamic>> getCurrentUser(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/auth/me'),
      headers: {'Authorization': 'Bearer $token'},
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to get user');
    }
  }

  // Méthode pour récupérer les réservations de l'utilisateur
  static Future<List<dynamic>> fetchMyReservations(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/reservations/me'),
      headers: {'Authorization': 'Bearer $token'},
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load reservations');
    }
  }

  // Méthode pour créer une réservation
  static Future<Map<String, dynamic>> createReservation(String token, Map<String, dynamic> reservationData) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/reservations'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: json.encode(reservationData),
    );

    if (response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to create reservation');
    }
  }
}