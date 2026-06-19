import { Worktree } from '../types';

export const INITIAL_WORKTREES: Worktree[] = [
  {
    id: 'wt-login',
    name: 'feature-login',
    branch: 'feature/oauth-login',
    path: '/Users/developer/AndroidStudioProjects/MyAwesomeApp/worktrees/feature-login',
    modifiedCount: 4,
    addedLines: 142,
    deletedLines: 35,
    files: [
      {
        filename: 'LoginActivity.kt',
        filepath: 'app/src/main/java/com/example/app/ui/login/LoginActivity.kt',
        language: 'kotlin',
        originalContent: `package com.example.app.ui.login

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.example.app.databinding.ActivityLoginBinding

class LoginActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState);
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.buttonLogin.setOnClickListener {
            val username = binding.editTextUsername.text.toString()
            val password = binding.editTextPassword.text.toString()
            performLegacyLogin(username, password)
        }
    }

    private fun performLegacyLogin(u: String, p: String) {
        // Old insecure verification code
    }
}`,
        modifiedContent: `package com.example.app.ui.login

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.app.databinding.ActivityLoginBinding
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding
    private val viewModel by lazy { LoginViewModel() }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.buttonLogin.setOnClickListener {
            val username = binding.editTextUsername.text.toString()
            val password = binding.editTextPassword.text.toString()
            
            if (username.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Empty fields!", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            viewModel.login(username, password)
        }

        lifecycleScope.launch {
            viewModel.loginState.collect { state ->
                when (state) {
                    is LoginState.Success -> {
                        Toast.makeText(this@LoginActivity, "Welcome back!", Toast.LENGTH_SHORT).show()
                        finish()
                    }
                    is LoginState.Error -> {
                        binding.textError.text = state.message
                    }
                    else -> {}
                }
            }
        }
    }
}`,
        addedLinesCount: 28,
        deletedLinesCount: 5,
      },
      {
        filename: 'LoginViewModel.kt',
        filepath: 'app/src/main/java/com/example/app/ui/login/LoginViewModel.kt',
        language: 'kotlin',
        originalContent: `package com.example.app.ui.login

import androidx.lifecycle.ViewModel

class LoginViewModel : ViewModel() {
    // Left empty initially
}`,
        modifiedContent: `package com.example.app.ui.login

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

sealed class LoginState {
    object Idle : LoginState()
    object Loading : LoginState()
    data class Success(val user: String) : LoginState()
    data class Error(val message: String) : LoginState()
}

class LoginViewModel : ViewModel() {
    private val _loginState = MutableStateFlow<LoginState>(LoginState.Idle)
    val loginState: StateFlow<LoginState> = _loginState

    fun login(u: String, p: String) {
        viewModelScope.launch {
            _loginState.value = LoginState.Loading
            try {
                if (u == "admin" && p == "password123") {
                    _loginState.value = LoginState.Success(u)
                } else {
                    _loginState.value = LoginState.Error("Invalid credentials")
                }
            } catch (e: Exception) {
                _loginState.value = LoginState.Error(e.message ?: "Unknown error")
            }
        }
    }
}`,
        addedLinesCount: 30,
        deletedLinesCount: 2,
      },
      {
        filename: 'LoginUseCase.kt',
        filepath: 'app/src/main/java/com/example/app/domain/login/LoginUseCase.kt',
        language: 'kotlin',
        originalContent: `package com.example.app.domain.login

class LoginUseCase {
    // Initial placeholder logic
}`,
        modifiedContent: `package com.example.app.domain.login

import com.example.app.data.repository.LoginRepository

class LoginUseCase(private val repository: LoginRepository) {
    suspend operator fun invoke(params: LoginParams): Flow<Result<User>> {
        if (params.username.length < 3) {
            return flowOf(Result.failure(Exception("Username too short")))
        }
        return repository.authenticate(params.username, params.password)
    }
}`,
        addedLinesCount: 10,
        deletedLinesCount: 2,
      },
      {
        filename: 'activity_login.xml',
        filepath: 'app/src/main/res/layout/activity_login.xml',
        language: 'xml',
        originalContent: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <Button
        android:id="@+id/buttonLogin"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Login" />
</LinearLayout>`,
        modifiedContent: `<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:padding="24dp">
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical">
        
        <EditText
            android:id="@+id/editTextUsername"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="Username" />
            
        <EditText
            android:id="@+id/editTextPassword"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:inputType="textPassword"
            android:hint="Password" />

        <TextView
            android:id="@+id/textError"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:textColor="#ff0000" />
        
        <Button
            android:id="@+id/buttonLogin"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="Login Securely" />
    </LinearLayout>
</ScrollView>`,
        addedLinesCount: 32,
        deletedLinesCount: 7,
      }
    ],
  },
  {
    id: 'wt-payment',
    name: 'bugfix-payment-flow',
    branch: 'bugfix/payment-retry-crash',
    path: '/Users/developer/AndroidStudioProjects/MyAwesomeApp/worktrees/bugfix-payment',
    modifiedCount: 2,
    addedLines: 48,
    deletedLines: 12,
    files: [
      {
        filename: 'PaymentManager.kt',
        filepath: 'app/src/main/java/com/example/app/data/payment/PaymentManager.kt',
        language: 'kotlin',
        originalContent: `package com.example.app.data.payment

class PaymentManager {
    fun processPayment(amount: Double) {
        // Direct crash when payment service is offline
        paymentGateway.charge(amount)
    }
}`,
        modifiedContent: `package com.example.app.data.payment

import android.util.Log

class PaymentManager {
    private val maxRetries = 3

    fun processPayment(amount: Double): Boolean {
        var success = false
        var attempts = 0
        while (attempts < maxRetries && !success) {
            try {
                paymentGateway.charge(amount)
                success = true
                Log.d("Payment", "Payment charged successfully on attempt $attempts")
            } catch (e: Exception) {
                attempts++
                Log.w("Payment", "Attempt $attempts failed! Retrying...")
                Thread.sleep(1000) // retry backoff
            }
        }
        return success
    }
}`,
        addedLinesCount: 21,
        deletedLinesCount: 3,
      },
      {
        filename: 'PaymentManagerTest.kt',
        filepath: 'app/src/test/java/com/example/app/data/payment/PaymentManagerTest.kt',
        language: 'kotlin',
        originalContent: `package com.example.app.data.payment

import org.junit.Test
import org.junit.Assert.*

class PaymentManagerTest {
    @Test
    fun testProcess() {
        val pm = PaymentManager()
        pm.processPayment(10.0)
    }
}`,
        modifiedContent: `package com.example.app.data.payment

import org.junit.Test
import org.junit.Assert.*
import org.mockito.Mockito.*

class PaymentManagerTest {
    @Test
    fun testProcessWithRetrySuccess() {
        val mockGateway = mock(PaymentGateway::class.java)
        // Set up failures then success
        doThrow(RuntimeException("Network Down"))
            .doNothing()
            .when(mockGateway).charge(10.0)

        val pm = PaymentManager(mockGateway)
        val result = pm.processPayment(10.0)
        assertTrue(result)
        verify(mockGateway, times(2)).charge(10.0)
    }
}`,
        addedLinesCount: 19,
        deletedLinesCount: 5,
      }
    ],
  },
  {
    id: 'wt-refactor',
    name: 'refactor-animations',
    branch: 'refactor/ui-performance',
    path: '/Users/developer/AndroidStudioProjects/MyAwesomeApp/worktrees/refactor-animations',
    modifiedCount: 1,
    addedLines: 25,
    deletedLines: 10,
    files: [
      {
        filename: 'HomeFragment.kt',
        filepath: 'app/src/main/java/com/example/app/ui/home/HomeFragment.kt',
        language: 'kotlin',
        originalContent: `package com.example.app.ui.home

import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment

class HomeFragment : Fragment() {
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        // High rendering animation triggered repeatedly on main thread
        binding.animatedView.animate().rotation(360f).setDuration(5000).start()
    }
}`,
        modifiedContent: `package com.example.app.ui.home

import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import androidx.core.view.doOnPreDraw

class HomeFragment : Fragment() {
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        // Optimizing rendering performance to use Hardware layer acceleration
        view.doOnPreDraw {
            binding.animatedView.setLayerType(View.LAYER_TYPE_HARDWARE, null)
            binding.animatedView.animate()
                .rotation(360f)
                .setDuration(3000)
                .withEndAction {
                    binding.animatedView.setLayerType(View.LAYER_TYPE_NONE, null)
                }
                .start()
        }
    }
}`,
        addedLinesCount: 16,
        deletedLinesCount: 3,
      }
    ],
  }
];
