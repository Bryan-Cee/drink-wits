import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-white hover:text-white/70">
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy</h1>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Last Updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            1. Introduction
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            At Drink Wits, we are committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, and safeguard your information when you use our application.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            By using Drink Wits, you consent to the data practices described in this policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            2. Information Collection
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We collect minimal information necessary to provide and improve our services:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
            <li>
              <strong>Account Information:</strong> If you create an account, we collect basic
              information such as your username and email address.
            </li>
            <li>
              <strong>Game Data:</strong> We collect information about games you create or join to
              facilitate gameplay.
            </li>
            <li>
              <strong>Device Information:</strong> We automatically collect certain information
              about your device, including IP address, device type, and operating system for
              troubleshooting and service improvement.
            </li>
            <li>
              <strong>Usage Data:</strong> We collect anonymous information about how you use the
              application to improve user experience.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            3. How We Use Your Information
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We use the information we collect for the following purposes:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
            <li>To provide and maintain our service</li>
            <li>To improve and personalize user experience</li>
            <li>To communicate with you about updates or changes to our service</li>
            <li>To monitor and analyze usage patterns and trends</li>
            <li>To detect, prevent, and address technical issues</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            4. Information Sharing
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            <strong>
              We do not sell, trade, or otherwise transfer your personally identifiable information
              to outside parties.
            </strong>{' '}
            Your privacy is paramount to us.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We may share information under the following limited circumstances:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
            <li>
              <strong>With Service Providers:</strong> We may share information with trusted third
              parties who assist us in operating our application, conducting our business, or
              servicing you, so long as those parties agree to keep this information confidential.
            </li>
            <li>
              <strong>For Legal Purposes:</strong> We may disclose information when required by law
              or in the good-faith belief that such action is necessary to comply with legal
              obligations.
            </li>
            <li>
              <strong>With Your Consent:</strong> We may share information with third parties when
              we have your explicit consent to do so.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            5. Data Security
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            We implement appropriate security measures to protect against unauthorized access,
            alteration, disclosure, or destruction of your personal information. However, no method
            of transmission over the Internet or electronic storage is 100% secure, and we cannot
            guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            6. Age Restrictions
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Drink Wits is intended for users who are of legal drinking age in their respective
            jurisdictions. We do not knowingly collect personal information from individuals under
            the legal drinking age. If we learn we have collected personal information from an
            underage user, we will delete that information promptly.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            7. Your Rights
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Depending on your location, you may have certain rights regarding your personal
            information, including:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
            <li>The right to access the personal information we have about you</li>
            <li>The right to request correction of inaccurate information</li>
            <li>The right to request deletion of your information</li>
            <li>The right to opt-out of certain data collection or processing</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            8. Changes to This Policy
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            We may update our Privacy Policy from time to time. We will notify you of any changes by
            posting the new Privacy Policy on this page and updating the "Last Updated" date at the
            top. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            9. Contact Us
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            If you have any questions about this Privacy Policy, please contact us at
            privacy@drinkwits.com.
          </p>
        </section>
      </div>
    </div>
  );
}
