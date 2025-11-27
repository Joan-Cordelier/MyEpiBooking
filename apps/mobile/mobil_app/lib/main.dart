import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'Pages/home.dart';
import 'Pages/rooms.dart';
import 'Pages/profil.dart';
import 'Pages/my_reservation.dart';
import 'Pages/new_booking.dart';
import 'Pages/login.dart';
import 'Provider/auth_provider.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => AuthProvider()..checkAuth(),
      child: const EpiBookingApp(),
    ),
  );
}

class EpiBookingApp extends StatefulWidget {
  const EpiBookingApp({super.key});

  @override
  State<EpiBookingApp> createState() => _EpiBookingAppState();
}

class _EpiBookingAppState extends State<EpiBookingApp> {
  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, auth, child) {
        if (auth.isLoading) {
          return const MaterialApp(
            home: Scaffold(
              body: Center(child: CircularProgressIndicator()),
            ),
          );
        }
        return MaterialApp(
          title: 'EPI Booking',
          debugShowCheckedModeBanner: false,
          theme: ThemeData(
            primaryColor: const Color(0xFF3B26FF),
            fontFamily: 'Roboto',
          ),
          initialRoute: auth.isAuthenticated ? '/' : '/login',
          routes: {
            '/login': (context) => const LoginPage(),
            '/': (context) => const HomePage(),
            '/rooms': (context) => const RoomsPage(),
            '/profile': (context) => const ProfilePage(),
            '/myReservations': (context) => const MyReservationsPage(),
            '/newBooking': (context) => const NewBookingPage(),
          },
        );
      },
    );
  }
}
