plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

val configuredAppUrl = (project.findProperty("KD_APP_URL") as String?)
    ?: System.getenv("KD_APP_URL")
    ?: "https://kddmovies.vercel.app"

android {
    namespace = "com.kdmovies.tv"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.kdmovies.tv"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        buildConfigField("String", "APP_URL", "\"$configuredAppUrl\"")
    }

    signingConfigs {
        val keystorePath = System.getenv("KEYSTORE_FILE")
        if (!keystorePath.isNullOrBlank() && file(keystorePath).exists()) {
            create("release") {
                storeFile = file(keystorePath)
                storePassword = System.getenv("KEYSTORE_PASSWORD") ?: ""
                keyAlias = System.getenv("KEY_ALIAS") ?: ""
                keyPassword = System.getenv("KEY_PASSWORD") ?: ""
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            val hasReleaseKeystore = signingConfigs.findByName("release") != null
            signingConfig = if (hasReleaseKeystore) {
                signingConfigs.getByName("release")
            } else {
                signingConfigs.getByName("debug")
            }
        }
        debug {
            applicationIdSuffix = ".debug"
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        buildConfig = true
    }

    lint {
        abortOnError = false
        checkReleaseBuilds = false
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.15.0")
}
