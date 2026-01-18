import emailjs from '@emailjs/browser';
import { Env } from '@/src/config/env';

export interface ContactFormData {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export interface EmailJSResponse {
  success: boolean;
  error?: string;
}

/**
 * Initialize EmailJS with public key
 * Call this once when the app loads
 */
export function initEmailJS(): void {
  if (!Env.EMAILJS_PUBLIC_KEY) {
    console.warn('EmailJS public key not configured');
    return;
  }
  emailjs.init(Env.EMAILJS_PUBLIC_KEY);
}

/**
 * Send contact form via EmailJS
 * Template variables: {{name}}, {{email}}, {{topic}}, {{message}}
 * Reply-To configured in template: {{email}}
 * From Email configured in template: contact@auschildsupport.com.au
 */
export async function sendContactEmail(
  formData: ContactFormData
): Promise<EmailJSResponse> {
  // Validate environment configuration
  if (!Env.EMAILJS_SERVICE_ID || !Env.EMAILJS_TEMPLATE_ID || !Env.EMAILJS_PUBLIC_KEY) {
    return {
      success: false,
      error: 'Email service not configured. Please contact support.',
    };
  }

  try {
    const templateParams = {
      name: formData.name,
      email: formData.email,
      topic: formData.topic,
      message: formData.message,
    };

    const response = await emailjs.send(
      Env.EMAILJS_SERVICE_ID,
      Env.EMAILJS_TEMPLATE_ID,
      templateParams
    );

    if (response.status === 200) {
      return { success: true };
    } else {
      return {
        success: false,
        error: 'Failed to send message. Please try again.',
      };
    }
  } catch (error) {
    console.error('EmailJS error:', error);
    return {
      success: false,
      error: 'Unable to send message. Please try again.',
    };
  }
}
