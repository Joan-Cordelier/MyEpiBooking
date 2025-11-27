class User {
  final String id;
  final String email;
  final String? name;
  final String? firstName;
  final String? actualPromotion;
  final String? photo;
  final String? campusId;

  User({
    required this.id,
    required this.email,
    this.name,
    this.firstName,
    this.actualPromotion,
    this.photo,
    this.campusId,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      email: json['email'],
      name: json['name'],
      firstName: json['firstName'],
      actualPromotion: json['actual_promotion'],
      photo: json['photo'],
      campusId: json['campusId'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'firstName': firstName,
      'actual_promotion': actualPromotion,
      'photo': photo,
      'campusId': campusId,
    };
  }
}