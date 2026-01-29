import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'Pages/home.dart';
import 'Pages/rooms.dart';
import 'Pages/profil.dart';
import 'Pages/my_reservation.dart';
import 'Pages/new_booking.dart';
import 'Pages/login.dart';
import 'Pages/register.dart';
import 'Provider/auth_provider.dart';
import 'Provider/reservation_provider.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => AuthProvider()),
        ChangeNotifierProvider(create: (context) => ReservationProvider()),
      ],
      child: const EpiBookingApp(),
    ),
  );
}

class EpiBookingApp extends StatelessWidget {
  const EpiBookingApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'EPI Booking',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: const Color(0xFF3B26FF),
        fontFamily: 'Roboto',
      ),
      home: const AuthWrapper(),
      routes: {
        '/login': (context) => const LoginPage(),
        '/register': (context) => const RegisterPage(),
        '/home': (context) => const HomePage(),
        '/rooms': (context) => const RoomsPage(),
        '/profile': (context) => const ProfilePage(),
        '/myReservations': (context) => const MyReservationsPage(),
        '/newBooking': (context) => const NewBookingPage(),
      },
    );
  }
}

class AuthWrapper extends StatefulWidget {
  const AuthWrapper({super.key});

  @override
  State<AuthWrapper> createState() => _AuthWrapperState();
}

class _AuthWrapperState extends State<AuthWrapper> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<AuthProvider>().checkAuth();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, _) {
        if (authProvider.isLoading) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        if (authProvider.isAuthenticated) {
          return const HomePage();
        }

        return const LoginPage();
      },
    );
  }
}
