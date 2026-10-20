package com.nseen.app.ui.screens.paywall

import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nseen.app.license.*
import com.nseen.app.ui.theme.*
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PaywallScreen(
    licenseManager: LicenseManager,
    onBack: () -> Unit,
    onLicenseUnlocked: () -> Unit
) {
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current
    val coroutineScope = rememberCoroutineScope()

    val licenseState by licenseManager.licenseState.collectAsState()
    val displayDeviceId = remember { DeviceFingerprintHelper.getDisplayDeviceId(context) }

    var showPaymentSheet by remember { mutableStateOf(false) }
    var showGoogleSignInDialog by remember { mutableStateOf(false) }
    var selectedMethod by remember { mutableStateOf(PaymentManager.PaymentMethod.BKASH) }

    var senderNumber by remember { mutableStateOf("") }
    var trxId by remember { mutableStateOf("") }
    var isSubmittingPayment by remember { mutableStateOf(false) }
    var paymentErrorMessage by remember { mutableStateOf<String?>(null) }

    // If license becomes active, notify parent
    LaunchedEffect(licenseState) {
        if (licenseState is LicenseState.Active || licenseState is LicenseState.OfflineGrace) {
            Toast.makeText(context, "অভিনন্দন! আপনার ১৫০ ৳ লাইফটাইম লাইসেন্স সক্রিয় রয়েছে।", Toast.LENGTH_LONG).show()
            onLicenseUnlocked()
        }
    }

    Scaffold(
        containerColor = NseenSurface,
        topBar = {
            TopAppBar(
                title = { Text("Nseen Pro লাইফটাইম", fontWeight = FontWeight.Bold, color = NseenOnSurface) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(
                            Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back",
                            tint = NseenOnSurface
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = NseenSurface)
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp, vertical = 8.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {

            // ── Hero Badge ────────────────────────────────────────────────────────
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .clip(CircleShape)
                    .background(
                        Brush.radialGradient(
                            colors = listOf(NseenGreen.copy(alpha = 0.35f), NseenGreenContainer)
                        )
                    )
                    .border(2.dp, NseenGreen, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.WorkspacePremium,
                    contentDescription = "Pro Lifetime",
                    tint = NseenGreen,
                    modifier = Modifier.size(44.dp)
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "আজীবন অ্যাক্সেস (Lifetime Pro)",
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                color = NseenOnSurface,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(6.dp))

            // Pricing Tag
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center,
                modifier = Modifier
                    .clip(RoundedCornerShape(30.dp))
                    .background(NseenGreenContainer)
                    .border(1.dp, NseenGreen.copy(alpha = 0.5f), RoundedCornerShape(30.dp))
                    .padding(horizontal = 16.dp, vertical = 6.dp)
            ) {
                Text(
                    text = "মাত্র ১৫০ ৳",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = NseenGreen
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "• এককালীন পেমেন্ট",
                    fontSize = 13.sp,
                    color = NseenOnSurfaceVariant
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            // ── Value Props ───────────────────────────────────────────────────────
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = NseenSurfaceCard)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    FeatureRow(
                        icon = Icons.Default.Visibility,
                        title = "ডিলিট হওয়া মেসেজ চিরতরে দেখুন",
                        subtitle = "WhatsApp, Messenger ও Telegram-এর মুছে ফেলা মেসেজ স্বয়ংক্রিয়ভাবে সংরক্ষিত থাকে।"
                    )
                    Spacer(modifier = Modifier.height(14.dp))
                    FeatureRow(
                        icon = Icons.Default.AllInclusive,
                        title = "আজীবন অ্যাক্সেস (কোনো মাসিক চার্জ নেই)",
                        subtitle = "একবার ১৫০ ৳ দিয়ে কিনলে আজীবন ব্যবহার ও সকল ভবিষ্যৎ আপডেট ফ্রিতে পাবেন।"
                    )
                    Spacer(modifier = Modifier.height(14.dp))
                    FeatureRow(
                        icon = Icons.Default.PhonelinkSetup,
                        title = "রি-ইনস্টল গ্যারান্টি (১ ডিভাইস + ১ জিমেইল)",
                        subtitle = "এই ফোন থেকে আনইনস্টল করলেও পরবর্তীতে গুগল সাইন ইন করলেই লাইসেন্স স্বয়ংক্রিয়ভাবে ফিরে আসবে।"
                    )
                    Spacer(modifier = Modifier.height(14.dp))
                    FeatureRow(
                        icon = Icons.Default.Security,
                        title = "১০০% প্রাইভেট ও অফলাইন ডাটা",
                        subtitle = "আপনার মেসেজ কোনো সার্ভারে যায় না। সম্পূর্ণ ডাটা আপনার ফোনের ভেতর নিরাপদ থাকে।"
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // ── Device & Account Status ───────────────────────────────────────────
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = NseenSurfaceVariant)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(
                            Icons.Default.PhoneAndroid,
                            contentDescription = "Device",
                            tint = NseenGreen,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "ডিভাইস আইডি: $displayDeviceId",
                            fontSize = 13.sp,
                            color = NseenOnSurfaceVariant,
                            fontWeight = FontWeight.Medium
                        )
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    val accountText = when (val state = licenseState) {
                        is LicenseState.Unlicensed -> "সংযুক্ত গুগল একাউন্ট: ${state.email}"
                        is LicenseState.Active -> "সংযুক্ত গুগল একাউন্ট: ${state.license.email}"
                        is LicenseState.DeviceMismatch -> "লক করা একাউন্ট: ${state.email}"
                        else -> "গুগল একাউন্ট সংযুক্ত করা হয়নি"
                    }

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(
                            Icons.Default.AccountCircle,
                            contentDescription = "Google Account",
                            tint = if (licenseState is LicenseState.Unauthenticated) Color.Gray else NseenGreen,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = accountText,
                            fontSize = 13.sp,
                            color = NseenOnSurface,
                            fontWeight = FontWeight.Medium
                        )
                    }

                    if (licenseState is LicenseState.DeviceMismatch) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "সতর্কতা: এই গুগল অ্যাকাউন্টের লাইসেন্সটি পূর্বে অন্য ফোনে সক্রিয় করা হয়েছে। পলিসি অনুযায়ী ১টি লাইসেন্স কেবল ১টি ডিভাইসে ব্যবহারযোগ্য।",
                            fontSize = 12.sp,
                            color = DeletedBadgeColor,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // ── Primary Call to Actions ───────────────────────────────────────────
            if (licenseState is LicenseState.Unauthenticated) {
                Button(
                    onClick = { showGoogleSignInDialog = true },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = NseenGreen)
                ) {
                    Icon(
                        Icons.Default.Login,
                        contentDescription = "Sign in",
                        tint = Color(0xFF002B22)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "গুগল একাউন্ট দিয়ে শুরু করুন",
                        color = Color(0xFF002B22),
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )
                }
            } else {
                Button(
                    onClick = { showPaymentSheet = true },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = NseenGreen)
                ) {
                    Icon(
                        Icons.Default.Payment,
                        contentDescription = "Pay",
                        tint = Color(0xFF002B22)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "১৫০ ৳ দিয়ে আনলক করুন (bKash/Nagad)",
                        color = Color(0xFF002B22),
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                OutlinedButton(
                    onClick = {
                        coroutineScope.launch {
                            val email = (licenseState as? LicenseState.Unlicensed)?.email ?: "user@gmail.com"
                            val uid = (licenseState as? LicenseState.Unlicensed)?.googleUid ?: "UID"
                            val res = licenseManager.restoreLicense(uid, email)
                            if (res.isSuccess) {
                                Toast.makeText(context, "লাইসেন্স সফলভাবে রিস্টোর হয়েছে!", Toast.LENGTH_SHORT).show()
                            } else {
                                Toast.makeText(context, res.exceptionOrNull()?.message ?: "লাইসেন্স পাওয়া যায়নি", Toast.LENGTH_LONG).show()
                            }
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp),
                    shape = RoundedCornerShape(12.dp),
                    border = ButtonDefaults.outlinedButtonBorder.copy(brush = Brush.horizontalGradient(listOf(NseenGreen, NseenGreenDark)))
                ) {
                    Icon(Icons.Default.Restore, contentDescription = "Restore", tint = NseenGreen)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("পূর্বের ক্রয় রিস্টোর করুন (Restore)", color = NseenGreen, fontWeight = FontWeight.SemiBold)
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }

    // ── Google Sign In Dialog ─────────────────────────────────────────────────
    if (showGoogleSignInDialog) {
        var emailInput by remember { mutableStateOf("") }
        AlertDialog(
            onDismissRequest = { showGoogleSignInDialog = false },
            title = { Text("গুগল একাউন্ট নির্বাচন", fontWeight = FontWeight.Bold, color = NseenOnSurface) },
            text = {
                Column {
                    Text(
                        text = "আপনার যে গুগল একাউন্টের সাথে লাইফটাইম লাইসেন্সটি বাঁধতে চান সেটি লিখুন।",
                        fontSize = 14.sp,
                        color = NseenOnSurfaceVariant
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    OutlinedTextField(
                        value = emailInput,
                        onValueChange = { emailInput = it },
                        placeholder = { Text("e.g. yourname@gmail.com") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val validEmail = emailInput.trim().ifBlank { "rimon.user@gmail.com" }
                        coroutineScope.launch {
                            val res = GoogleAuthHelper.signInWithGoogle(context, validEmail)
                            res.onSuccess { data ->
                                licenseManager.onGoogleSignInSuccess(data.uid, data.email)
                                showGoogleSignInDialog = false
                            }
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = NseenGreen)
                ) {
                    Text("কন্টিনিউ", color = Color(0xFF002B22), fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { showGoogleSignInDialog = false }) {
                    Text("বাতিল", color = NseenOnSurfaceVariant)
                }
            },
            containerColor = NseenSurfaceCard
        )
    }

    // ── Bangladesh Payment Bottom Sheet ───────────────────────────────────────
    if (showPaymentSheet) {
        val targetNumber = when (selectedMethod) {
            PaymentManager.PaymentMethod.BKASH -> PaymentManager.DEFAULT_BKASH_NUMBER
            PaymentManager.PaymentMethod.NAGAD -> PaymentManager.DEFAULT_NAGAD_NUMBER
            PaymentManager.PaymentMethod.ROCKET -> PaymentManager.DEFAULT_ROCKET_NUMBER
        }

        ModalBottomSheet(
            onDismissRequest = {
                showPaymentSheet = false
                paymentErrorMessage = null
            },
            containerColor = NseenSurfaceCard
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 12.dp)
                    .verticalScroll(rememberScrollState())
            ) {
                Text(
                    text = "১৫০ ৳ মোবাইল ব্যাংকিং পেমেন্ট",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = NseenOnSurface
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Payment Method Selector Tabs
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    PaymentMethodTab(
                        title = "bKash",
                        color = BkashPink,
                        isSelected = selectedMethod == PaymentManager.PaymentMethod.BKASH,
                        modifier = Modifier.weight(1f),
                        onClick = { selectedMethod = PaymentManager.PaymentMethod.BKASH }
                    )
                    PaymentMethodTab(
                        title = "Nagad",
                        color = NagadOrange,
                        isSelected = selectedMethod == PaymentManager.PaymentMethod.NAGAD,
                        modifier = Modifier.weight(1f),
                        onClick = { selectedMethod = PaymentManager.PaymentMethod.NAGAD }
                    )
                    PaymentMethodTab(
                        title = "Rocket",
                        color = RocketPurple,
                        isSelected = selectedMethod == PaymentManager.PaymentMethod.ROCKET,
                        modifier = Modifier.weight(1f),
                        onClick = { selectedMethod = PaymentManager.PaymentMethod.ROCKET }
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Payment Instruction Box
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = NseenSurfaceVariant),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Text(
                            text = "১. আপনার ${selectedMethod.displayName} অ্যাপে যান এবং Send Money করুন:",
                            fontSize = 13.sp,
                            color = NseenOnSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(6.dp))

                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween,
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(8.dp))
                                .background(NseenSurfaceHighlight)
                                .padding(horizontal = 12.dp, vertical = 8.dp)
                        ) {
                            Text(
                                text = targetNumber,
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = NseenGreen
                            )
                            IconButton(
                                onClick = {
                                    clipboardManager.setText(AnnotatedString(targetNumber))
                                    Toast.makeText(context, "নম্বর কপি করা হয়েছে!", Toast.LENGTH_SHORT).show()
                                },
                                modifier = Modifier.size(32.dp)
                            ) {
                                Icon(Icons.Default.ContentCopy, contentDescription = "Copy", tint = NseenGreen)
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "২. মোট পরিমাণ: ১৫০ ৳ (একশত পঞ্চাশ টাকা)",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = NseenOnSurface
                        )
                        Text(
                            text = "৩. ট্রানজেকশন সম্পন্ন হলে প্রাপ্ত TrxID নিচে লিখুন।",
                            fontSize = 13.sp,
                            color = NseenOnSurfaceVariant
                        )
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Input fields
                OutlinedTextField(
                    value = senderNumber,
                    onValueChange = { senderNumber = it },
                    label = { Text("যে নম্বর থেকে টাকা পাঠিয়েছেন (Sender Mobile)") },
                    placeholder = { Text("e.g. 01712345678") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(10.dp))

                OutlinedTextField(
                    value = trxId,
                    onValueChange = { trxId = it.uppercase() },
                    label = { Text("Transaction ID (TrxID)") },
                    placeholder = { Text("e.g. BKH82918A2") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )

                AnimatedVisibility(visible = paymentErrorMessage != null) {
                    paymentErrorMessage?.let {
                        Text(
                            text = it,
                            color = DeletedBadgeColor,
                            fontSize = 12.sp,
                            modifier = Modifier.padding(top = 6.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(18.dp))

                Button(
                    onClick = {
                        val state = licenseState
                        val userEmail = (state as? LicenseState.Unlicensed)?.email ?: "rimon.user@gmail.com"
                        val userUid = (state as? LicenseState.Unlicensed)?.googleUid ?: "UID"
                        val deviceId = DeviceFingerprintHelper.getDeviceId(context)

                        isSubmittingPayment = true
                        paymentErrorMessage = null

                        coroutineScope.launch {
                            val request = PaymentManager.PaymentRequest(
                                method = selectedMethod,
                                senderNumber = senderNumber,
                                transactionId = trxId,
                                userEmail = userEmail,
                                googleUid = userUid,
                                deviceId = deviceId
                            )
                            val result = PaymentManager.submitPayment(request)
                            isSubmittingPayment = false

                            when (result) {
                                is PaymentManager.PaymentResult.Success -> {
                                    licenseManager.activateLifetimeLicense(
                                        googleUid = userUid,
                                        email = userEmail,
                                        transactionId = result.transactionId,
                                        paymentMethod = selectedMethod.displayName
                                    )
                                    showPaymentSheet = false
                                }
                                is PaymentManager.PaymentResult.Failed -> {
                                    paymentErrorMessage = result.error
                                }
                                is PaymentManager.PaymentResult.PendingVerification -> {
                                    paymentErrorMessage = result.message
                                }
                            }
                        }
                    },
                    enabled = !isSubmittingPayment && senderNumber.isNotBlank() && trxId.isNotBlank(),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = NseenGreen)
                ) {
                    if (isSubmittingPayment) {
                        CircularProgressIndicator(color = Color(0xFF002B22), modifier = Modifier.size(24.dp))
                    } else {
                        Text("পেমেন্ট যাচাই ও অ্যাক্টিভেট করুন", color = Color(0xFF002B22), fontWeight = FontWeight.Bold, fontSize = 15.sp)
                    }
                }

                Spacer(modifier = Modifier.height(18.dp))
            }
        }
    }
}

@Composable
private fun FeatureRow(
    icon: ImageVector,
    title: String,
    subtitle: String
) {
    Row(
        verticalAlignment = Alignment.Top,
        modifier = Modifier.fillMaxWidth()
    ) {
        Box(
            modifier = Modifier
                .size(36.dp)
                .clip(CircleShape)
                .background(NseenGreenContainer),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = NseenGreen,
                modifier = Modifier.size(20.dp)
            )
        }
        Spacer(modifier = Modifier.width(12.dp))
        Column {
            Text(
                text = title,
                fontSize = 15.sp,
                fontWeight = FontWeight.SemiBold,
                color = NseenOnSurface
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = subtitle,
                fontSize = 13.sp,
                color = NseenOnSurfaceVariant,
                lineHeight = 18.sp
            )
        }
    }
}

@Composable
private fun PaymentMethodTab(
    title: String,
    color: Color,
    isSelected: Boolean,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(10.dp))
            .background(if (isSelected) color.copy(alpha = 0.2f) else NseenSurfaceHighlight)
            .border(
                width = if (isSelected) 2.dp else 1.dp,
                color = if (isSelected) color else Color.Transparent,
                shape = RoundedCornerShape(10.dp)
            )
            .clickable(onClick = onClick)
            .padding(vertical = 10.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = title,
            fontSize = 14.sp,
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
            color = if (isSelected) color else NseenOnSurfaceVariant
        )
    }
}
