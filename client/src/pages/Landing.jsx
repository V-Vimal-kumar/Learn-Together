import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="flex flex-col-reverse md:flex-row items-center justify-between px-6 py-16 max-w-6xl mx-auto gap-12">
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight">
            Learn Smarter. <br />
            <span className="text-accent">Together.</span>
          </h1>
          <p className="text-gray-600 mb-6 text-lg">
            Welcome to <strong>LearnTogether</strong> — the platform where learners team up, share progress, and finish courses together. Never learn alone again!
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              to="/register"
              className="px-6 py-3 bg-primary text-white font-semibold rounded-xl shadow-sm hover:bg-blue-700 transition duration-200"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 border border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition duration-200"
            >
              Login
            </Link>
          </div>
        </div>
        <div className="md:w-1/2">
          <img
            src="https://img.freepik.com/free-photo/young-colleagues-studying-from-notebook-laptop-study-session_23-2149265710.jpg?semt=ais_hybrid&w=740"
            alt="learning together"
            className="w-full max-w-md mx-auto rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          />
        </div>
      </header>

      {/* Why LearnTogether */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary mb-6">Why LearnTogether?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-8">
            {[
              {
                icon: '👥',
                title: 'Pair Learning',
                desc: 'Get auto-paired with a buddy learning the same course. Motivate and track each other.',
              },
              {
                icon: '📊',
                title: 'Progress Tracking',
                desc: 'Track your learning with intuitive progress bars and module-wise tracking.',
              },
              {
                icon: '🛠️',
                title: 'Admin Tools',
                desc: 'Manage users, update roles, and control courses with a dedicated admin panel.',
              },
            ].map(({ icon, title, desc }, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow duration-200"
              >
                <h3 className="text-xl font-semibold text-accent mb-2">
                  {icon} {title}
                </h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <footer className="bg-primary text-white py-8 px-6 mt-auto">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-2">Ready to start learning together?</h3>
          <p className="mb-4">Join now and team up with learners like you!</p>
          <Link
            to="/register"
            className="inline-block px-6 py-3 bg-white text-primary font-semibold rounded-xl shadow hover:bg-gray-100 transition duration-150"
          >
            Register for Free
          </Link>
        </div>
      </footer>
    </div>
  );
}
