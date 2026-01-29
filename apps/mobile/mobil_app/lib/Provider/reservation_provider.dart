import 'package:flutter/material.dart';
import '../Model/room.dart';
import '../Model/reservation.dart';
import '../Service/api_service.dart';
import '../Service/auth_service.dart';

class ReservationProvider with ChangeNotifier {
  List<Room> _rooms = [];
  List<Reservation> _myReservations = [];
  bool _isLoading = false;
  String? _error;

  List<Room> get rooms => _rooms;
  List<Reservation> get myReservations => _myReservations;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Récupérer toutes les salles
  Future<void> fetchRooms() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final roomsData = await ApiService.fetchRooms();
      _rooms = (roomsData as List).map((room) => Room.fromJson(room)).toList();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Récupérer mes réservations
  Future<void> fetchMyReservations() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final token = await AuthService.getToken();
      if (token != null) {
        final reservationsData = await ApiService.fetchMyReservations(token);
        _myReservations = (reservationsData as List).map((res) => Reservation.fromJson(res)).toList();
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Créer une réservation
  Future<bool> createReservation(
    String roomId,
    DateTime startTime,
    DateTime endTime,
    String? reason,
    String title,
    String type,
  ) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final token = await AuthService.getToken();
      if (token == null) {
        _error = 'Utilisateur non authentifié';
        _isLoading = false;
        notifyListeners();
        return false;
      }

      // Log pour debug
      print('Creating reservation with roomId: $roomId');
      print('Rooms available: ${_rooms.map((r) => 'id=${r.id}, apiId=${r.apiId}').join(', ')}');

      // Skip availability check si ça échoue (le backend validera)
      bool? isAvailable;
      try {
        isAvailable = await ApiService.checkRoomAvailability(token, roomId, startTime, endTime);
      } catch (e) {
        print('Availability check skipped due to error: $e');
        isAvailable = null;
      }
      if (isAvailable == false) {
        _error = 'Cette salle n\'est pas disponible à cette heure';
        _isLoading = false;
        notifyListeners();
        return false;
      }

      final reservationData = {
        'roomId': roomId,
        'title': title,
        'type': type,
        'startDate': startTime.toUtc().toIso8601String(),
        'endDate': endTime.toUtc().toIso8601String(),
        if (reason != null && reason.isNotEmpty) 'reason': reason,
      };

      print('Sending reservation data: $reservationData');

      await ApiService.createReservation(token, reservationData);
      await fetchMyReservations();
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      print('Reservation error: $e');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
}
