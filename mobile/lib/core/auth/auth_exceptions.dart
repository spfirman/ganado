/// Thrown when OTP/2FA is required for login
class OtpRequiredError implements Exception {
  final String tempToken;
  final String message;

  OtpRequiredError({
    required this.tempToken,
    this.message = 'OTP verification required',
  });

  @override
  String toString() => message;
}

/// Thrown when authentication fails
class AuthenticationError implements Exception {
  final String message;

  AuthenticationError(this.message);

  @override
  String toString() => message;
}
