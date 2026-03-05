class Validators {
  static String? required(String? value, {String? fieldName}) {
    if (value == null || value.trim().isEmpty) {
      return '${fieldName ?? 'Campo'} es requerido';
    }
    return null;
  }

  static String? numeric(String? value, {String? fieldName}) {
    if (value == null || value.trim().isEmpty) return null;
    if (double.tryParse(value) == null) {
      return '${fieldName ?? 'Campo'} debe ser un numero';
    }
    return null;
  }

  static String? positiveNumber(String? value, {String? fieldName}) {
    if (value == null || value.trim().isEmpty) return null;
    final number = double.tryParse(value);
    if (number == null || number < 0) {
      return '${fieldName ?? 'Campo'} debe ser un numero positivo';
    }
    return null;
  }

  static String? email(String? value) {
    if (value == null || value.trim().isEmpty) return null;
    final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!emailRegex.hasMatch(value)) {
      return 'Email invalido';
    }
    return null;
  }

  static String? minLength(String? value, int min, {String? fieldName}) {
    if (value == null || value.trim().isEmpty) return null;
    if (value.length < min) {
      return '${fieldName ?? 'Campo'} debe tener al menos $min caracteres';
    }
    return null;
  }
}
