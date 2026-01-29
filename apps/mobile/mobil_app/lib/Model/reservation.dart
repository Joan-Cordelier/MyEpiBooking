class Reservation {
  final String id;
  final String roomId;
  final String userId;
  final DateTime startTime;
  final DateTime endTime;
  final String? title;
  final String? description;
  final String? type;
  final String? roomName;

  Reservation({
    required this.id,
    required this.roomId,
    required this.userId,
    required this.startTime,
    required this.endTime,
    this.title,
    this.description,
    this.type,
    this.roomName,
  });

  factory Reservation.fromJson(Map<String, dynamic> json) {
    return Reservation(
      id: json['id'] ?? '',
      roomId: json['roomId'] ?? '',
      userId: json['userId'] ?? '',
      startTime: DateTime.parse(json['startDate'] ?? json['start_time']),
      endTime: DateTime.parse(json['endDate'] ?? json['end_time']),
      title: json['title'],
      description: json['description'],
      type: json['type'],
      roomName: json['room']?['name'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'roomId': roomId,
      'startDate': startTime.toIso8601String(),
      'endDate': endTime.toIso8601String(),
      'title': title,
      'description': description,
      'type': type,
    };
  }
}
