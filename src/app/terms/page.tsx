import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-white hover:text-white/70">
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Terms of Service</h1>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Last Updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            By accessing or using the Drink Wits application ("the App"), you agree to be bound by
            these Terms of Service. If you do not agree to these terms, please do not use the App.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Drink Wits is intended for users who are of legal drinking age in their respective
            jurisdictions. By using the App, you confirm that you are of legal drinking age in your
            location.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            2. Disclaimer of Liability
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Drink Wits is provided "as is" and "as available" without any warranties of any kind,
            either express or implied. The developers of Drink Wits do not warrant that the App will
            be uninterrupted, timely, secure, or error-free.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            <strong>
              TO THE FULLEST EXTENT PERMITTED BY LAW, THE DEVELOPERS, OWNERS, AND OPERATORS OF DRINK
              WITS HEREBY DISCLAIM ALL LIABILITY FOR ANY INJURIES, DAMAGES, LOSSES, OR EXPENSES OF
              ANY KIND ARISING FROM OR RELATED TO THE USE OF THE APP.
            </strong>{' '}
            This includes, but is not limited to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-4">
            <li>
              Any physical injury, illness, or property damage resulting from alcohol consumption
            </li>
            <li>Any consequences of decisions made while under the influence of alcohol</li>
            <li>Any disputes or conflicts between users</li>
            <li>Any actions taken by users that violate local laws or regulations</li>
          </ul>
          <p className="text-gray-600 dark:text-gray-300">
            By using the App, you agree to use it responsibly and in accordance with all applicable
            laws. You acknowledge that alcohol consumption carries inherent risks, and you assume
            full responsibility for your own actions and welfare.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            3. Responsible Use
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Drink Wits promotes responsible drinking. Users are expected to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-4">
            <li>Never drink and drive or operate machinery under the influence of alcohol</li>
            <li>Be aware of personal limits and drink responsibly</li>
            <li>Respect the decisions of others regarding alcohol consumption</li>
            <li>Never pressure others to consume alcohol against their will</li>
            <li>Consider health conditions and medications that may be affected by alcohol</li>
          </ul>
          <p className="text-gray-600 dark:text-gray-300">
            The developers of Drink Wits are not responsible for enforcing these guidelines and bear
            no liability for users who fail to adhere to them.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            4. User Content
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Users may have the ability to submit or share content within the App. By submitting
            content, you grant Drink Wits a non-exclusive, royalty-free license to use, modify, and
            display such content within the App. You are solely responsible for any content you
            submit and warrant that you have all necessary rights to grant this license.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            5. Indemnification
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            You agree to indemnify, defend, and hold harmless the developers, operators, and owners
            of Drink Wits from and against any claims, liabilities, damages, losses, costs,
            expenses, or fees (including reasonable attorneys' fees) that arise from or relate to
            your use of the App, violation of these Terms, or infringement of any rights.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            6. Modifications to Terms
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            We reserve the right to modify these Terms at any time. Any changes will be effective
            immediately upon posting the updated Terms within the App. Your continued use of the App
            after such changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            7. Governing Law
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            These Terms shall be governed by and construed in accordance with the laws of the
            jurisdiction in which the developers of Drink Wits operate, without regard to its
            conflict of law provisions.
          </p>
        </section>
      </div>
    </div>
  );
}
