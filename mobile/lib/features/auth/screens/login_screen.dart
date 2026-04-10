import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/auth/auth_exceptions.dart';
import 'package:ganado_app/core/auth/auth_provider.dart';
import 'package:ganado_app/shared/utils/validators.dart';
import 'package:ganado_app/core/i18n/app_localizations.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen>
    with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _otpController = TextEditingController();
  bool _obscurePassword = true;

  // OTP state
  bool _otpRequired = false;
  String _tempToken = '';

  // Animation
  late AnimationController _animController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();

    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );

    _fadeAnimation = CurvedAnimation(
      parent: _animController,
      curve: Curves.easeOut,
    );

    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.05),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _animController,
      curve: Curves.easeOut,
    ));

    _animController.forward();
  }

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    _otpController.dispose();
    _animController.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    if (!_formKey.currentState!.validate()) return;

    try {
      await ref.read(authStateProvider.notifier).login(
            username: _usernameController.text.trim(),
            password: _passwordController.text,
          );
    } on OtpRequiredError catch (e) {
      // OTP is required, show OTP form
      setState(() {
        _otpRequired = true;
        _tempToken = e.tempToken;
        _otpController.clear();
      });
    } catch (e) {
      // Error handled by provider state
    }
  }

  Future<void> _verifyOtp() async {
    final l10n = AppLocalizations.of(context)!;

    if (_otpController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(l10n.otpRequired)),
      );
      return;
    }

    try {
      await ref.read(authStateProvider.notifier).loginWithOtp(
            tempToken: _tempToken,
            code: _otpController.text.trim(),
          );
    } catch (e) {
      // Error handled by provider state
    }
  }

  void _backToLogin() {
    setState(() {
      _otpRequired = false;
      _tempToken = '';
      _otpController.clear();
    });
    ref.read(authStateProvider.notifier).state =
        ref.read(authStateProvider).copyWith(errorMessage: null);
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final authState = ref.watch(authStateProvider);
    final theme = Theme.of(context);

    // Color values matching web design
    const Color primaryGreen = Color(0xFF2E7D32); // #2E7D32
    const Color primaryDark = Color(0xFF0d631b); // #0d631b

    return Scaffold(
      body: Container(
        // Light green tinted background (30% opacity)
        color: primaryGreen.withOpacity(0.3),
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: FadeTransition(
              opacity: _fadeAnimation,
              child: SlideTransition(
                position: _slideAnimation,
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 400),
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.1),
                          blurRadius: 16,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    padding: const EdgeInsets.all(32),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // ── Logo & header ──
                        Container(
                          width: 56,
                          height: 56,
                          decoration: BoxDecoration(
                            color: primaryGreen,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.pets,
                            size: 32,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          l10n.appName,
                          style: theme.textTheme.headlineLarge?.copyWith(
                            fontWeight: FontWeight.w800,
                            color: primaryDark,
                            letterSpacing: 1.2,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          _otpRequired
                              ? l10n.otpTitle
                              : l10n.loginSubtitle,
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: const Color(0xFF757575),
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 28),

                        // ── Error display ──
                        if (authState.errorMessage != null) ...[
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: const Color(0xFFFFEBEE),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: const Color(0xFFEF5350).withOpacity(0.3),
                              ),
                            ),
                            child: Text(
                              authState.errorMessage ?? l10n.error,
                              style: const TextStyle(
                                color: Color(0xFFEF5350),
                                fontSize: 14,
                              ),
                            ),
                          ),
                          const SizedBox(height: 20),
                        ],

                        // ── OTP Form ──
                        if (_otpRequired)
                          _buildOtpForm(l10n, authState, theme)
                        else
                          _buildLoginForm(l10n, authState, theme),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLoginForm(
    AppLocalizations l10n,
    AuthState authState,
    ThemeData theme,
  ) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          TextFormField(
            controller: _usernameController,
            decoration: InputDecoration(
              labelText: l10n.username,
              hintText: l10n.usernamePlaceholder,
              prefixIcon: const Icon(Icons.person_outline),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            textInputAction: TextInputAction.next,
            validator: (v) =>
                Validators.required(v, fieldName: l10n.username),
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _passwordController,
            decoration: InputDecoration(
              labelText: l10n.password,
              hintText: l10n.passwordPlaceholder,
              prefixIcon: const Icon(Icons.lock_outline),
              suffixIcon: IconButton(
                icon: Icon(_obscurePassword
                    ? Icons.visibility_off
                    : Icons.visibility),
                onPressed: () =>
                    setState(() => _obscurePassword = !_obscurePassword),
              ),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            obscureText: _obscurePassword,
            textInputAction: TextInputAction.done,
            onFieldSubmitted: (_) => _login(),
            validator: (v) =>
                Validators.required(v, fieldName: l10n.password),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            height: 48,
            child: FilledButton(
              onPressed: authState.isLoading ? null : _login,
              child: authState.isLoading
                  ? const SizedBox(
                      width: 24,
                      height: 24,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor:
                            AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                    )
                  : Text(
                      l10n.login,
                      style: theme.textTheme.labelLarge?.copyWith(
                        fontSize: 16,
                      ),
                    ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOtpForm(
    AppLocalizations l10n,
    AuthState authState,
    ThemeData theme,
  ) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: const Color(0xFFF1F8E9),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: const Color(0xFF558B2F).withOpacity(0.3),
            ),
          ),
          child: Text(
            l10n.otpSubtitle,
            style: const TextStyle(
              color: Color(0xFF558B2F),
              fontSize: 13,
              height: 1.4,
            ),
            textAlign: TextAlign.center,
          ),
        ),
        const SizedBox(height: 20),
        TextField(
          controller: _otpController,
          decoration: InputDecoration(
            labelText: l10n.otpCode,
            hintText: '000000',
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          keyboardType: TextInputType.number,
          textAlign: TextAlign.center,
          style: const TextStyle(
            fontSize: 18,
            letterSpacing: 2.0,
          ),
          maxLength: 8,
          textInputAction: TextInputAction.done,
          onSubmitted: (_) => _verifyOtp(),
        ),
        const SizedBox(height: 24),
        SizedBox(
          width: double.infinity,
          height: 48,
          child: FilledButton(
            onPressed: authState.isLoading ? null : _verifyOtp,
            child: authState.isLoading
                ? const SizedBox(
                    width: 24,
                    height: 24,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor:
                          AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  )
                : Text(
                    l10n.otpVerify,
                    style: theme.textTheme.labelLarge?.copyWith(
                      fontSize: 16,
                    ),
                  ),
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity,
          child: OutlinedButton(
            onPressed: authState.isLoading ? null : _backToLogin,
            child: Text(l10n.otpBack),
          ),
        ),
      ],
    );
  }
}
