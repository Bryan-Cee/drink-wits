import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-white hover:text-white/70">
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">About Drink Wits</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Our Story</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Drink Wits was created to bring friends together for memorable social experiences. Our
            game combines the best elements of traditional drinking games with modern social
            interactions, creating a unique platform for friends to connect, laugh, and create
            memories together.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            The concept was born out of countless social gatherings where we noticed that the most
            memorable moments came from shared experiences that pushed people slightly out of their
            comfort zones while maintaining a fun, safe environment.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-300">
            At Drink Wits, our mission is to facilitate meaningful social connections through
            entertaining and responsible gameplay. We believe that social drinking games can be fun
            and engaging while also promoting responsible drinking habits.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Responsible Play
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We strongly advocate for responsible drinking and gameplay. Drink Wits is designed for
            adults of legal drinking age and should always be played in a safe environment. Players
            should:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
            <li>Know their limits and drink responsibly</li>
            <li>Never drink and drive</li>
            <li>Respect others' choices to abstain or limit alcohol consumption</li>
            <li>Maintain a safe and inclusive environment for all players</li>
            <li>Consider using non-alcoholic alternatives if preferred</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-300">
            If you have any questions, feedback, or concerns about Drink Wits, please don't hesitate
            to reach out to us at support@drinkwits.com.
          </p>
        </section>
      </div>
    </div>
  );
}
