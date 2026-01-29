import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'http://10.0.2.2:3001';

  // Méthode pour récupérer toutes les salles
  static Future<List<dynamic>> fetchRooms() async {
    final response = await http.get(Uri.parse('$baseUrl/api/rooms')).timeout(const Duration(seconds: 5));

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      print('API fetchRooms response: $data');
      // Log le premier élément pour voir la structure
      if (data is List && data.isNotEmpty) {
        print('First room structure: ${data[0]}');
        print('First room keys: ${(data[0] as Map).keys.toList()}');
      }
      return data;
    } else {
      throw Exception('Failed to load rooms');
    }
  }

  // Méthode d'inscription
  static Future<Map<String, dynamic>> register(String email, String password, String name, String firstName) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'email': email, 'password': password, 'name': name, 'firstName': firstName}),
    ).timeout(const Duration(seconds: 5));

    if (response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to register');
    }
  }

  // Méthode de connexion
  static Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'email': email, 'password': password}),
    ).timeout(const Duration(seconds: 5));

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
    ).timeout(const Duration(seconds: 5));

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
    ).timeout(const Duration(seconds: 5));

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load reservations');
    }
  }

  // Méthode pour récupérer les réservations d'une salle
  static Future<List<dynamic>> fetchRoomReservations(String token, String roomId) async {
    final response = await http
        .get(
          Uri.parse('$baseUrl/api/reservations/rooms/$roomId'),
          headers: {'Authorization': 'Bearer $token'},
        )
        .timeout(const Duration(seconds: 5));

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load room reservations');
    }
  }

  // Méthode pour vérifier la disponibilité d'une salle
  static Future<bool> checkRoomAvailability(String token, String roomId, DateTime startTime, DateTime endTime) async {
    try {
      final reservations = await fetchRoomReservations(token, roomId);
      for (var reservation in reservations) {
        final startRaw = reservation['startDate'] ?? reservation['start_time'];
        final endRaw = reservation['endDate'] ?? reservation['end_time'];
        if (startRaw == null || endRaw == null) {
          continue;
        }

        final resStart = DateTime.parse(startRaw);
        final resEnd = DateTime.parse(endRaw);

        if (startTime.isBefore(resEnd) && endTime.isAfter(resStart)) {
          return false;
        }
      }
      return true;
    } catch (e) {
      throw Exception('Failed to check availability: $e');
    }
  }

  // Méthode pour créer une réservation
  static Future<Map<String, dynamic>> createReservation(String token, Map<String, dynamic> reservationData) async {
    print('API createReservation payload: $reservationData');
    final response = await http.post(
      Uri.parse('$baseUrl/api/reservations'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: json.encode(reservationData),
    ).timeout(const Duration(seconds: 5));

    print('API createReservation response: ${response.statusCode} ${response.body}');

    if (response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to create reservation: ${response.statusCode} ${response.body}');
    }
  }
}