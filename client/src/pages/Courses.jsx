// import { useEffect, useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useAxiosAuth } from '../hooks/useAxiosAuth';
// import toast from 'react-hot-toast';
// import { Link } from 'react-router-dom';

// export default function Courses() {
//   const { user } = useAuth();
//   const axiosAuth = useAxiosAuth();
//   const [courses, setCourses] = useState([]);
//   const [currentLearning, setCurrentLearning] = useState(null);
//   const [form, setForm] = useState({ title: '', description: '', category: '', totalModules: '', difficulty: '' });

//   const fetchCourses = async () => {
//     try {
//       const res = await axiosAuth.get(user?.role === 'Admin' ? '/courses' : '/courses/public');
//       setCourses(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     const fetchLearning = async () => {
//       try {
//         const res = await axiosAuth.get('/learning/me');
//         setCurrentLearning(res.data); // will be null if not joined
//       } catch (err) {
//         setCurrentLearning(null); // fallback if not enrolled
//       }
//     };

//     if (user) fetchLearning();
//   }, [user]);

//   useEffect(() => {
//     fetchCourses();
//   }, [user]);

//   const joinCourse = async (courseId) => {
//     if (
//       currentLearning &&
//       currentLearning.course !== courseId &&
//       !currentLearning.isComplete
//     ) {
//       toast.error('Complete or leave your current course before joining a new one.');
//       return;
//     }

//     try {
//       await axiosAuth.post('/learning/join', { courseId });
//       toast.success('Joined course successfully!');
//       // Refresh current learning
//       const res = await axiosAuth.get('/learning/me');
//       setCurrentLearning(res.data);
//     } catch (err) {
//       toast.error(err.response?.data?.error || 'Failed to join');
//     }
//   };


//   const createCourse = async () => {
//     try {
//       await axiosAuth.post('/courses', form);
//       toast.success('Course created!');
//       fetchCourses();
//       setForm({ title: '', description: '', category: '', totalModules: '', difficulty: '' });
//     } catch (err) {
//       toast.error('Creation failed');
//     }
//   };

//   const deleteCourse = async (id) => {
//     try {
//       await axiosAuth.delete(`/courses/${id}`);
//       toast.success('Deleted!');
//       fetchCourses();
//     } catch (err) {
//       toast.error('Failed to delete');
//     }
//   };

// courses.map((course) => {
//   const isCurrentCourse = currentLearning?.course === course._id;
//   const isCompleted = currentLearning?.isComplete;
//   const isBlocked =
//     currentLearning &&
//     !isCompleted &&
//     !isCurrentCourse;


//   return (
//     <div className="min-h-screen bg-background p-4 max-w-4xl mx-auto">
//       <h1 className="text-3xl font-bold text-primary mb-6 text-center">📚 Courses</h1>

//       {/* Admin Form */}
//       {user?.role === 'Admin' && (
//         <div className="bg-white p-4 rounded-xl shadow mb-6">
//           <h2 className="text-xl font-semibold mb-4">Add New Course</h2>
//           <div className="grid gap-2 md:grid-cols-2">
//             <input
//               type="text"
//               placeholder="Title"
//               value={form.title}
//               onChange={(e) => setForm({ ...form, title: e.target.value })}
//               className="input-style"
//             />
//             <input
//               type="text"
//               placeholder="Category"
//               value={form.category}
//               onChange={(e) => setForm({ ...form, category: e.target.value })}
//               className="input-style"
//             />
//             <input
//               type="number"
//               placeholder="Total Modules"
//               value={form.totalModules}
//               onChange={(e) => setForm({ ...form, totalModules: e.target.value })}
//               className="input-style"
//             />
//             <input
//               type="text"
//               placeholder="Description"
//               value={form.description}
//               onChange={(e) => setForm({ ...form, description: e.target.value })}
//               className="input-style"
//             />
//             <select
//               value={form.difficulty}
//               onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
//               className="input-style"
//             >
//               <option value="">Select Difficulty</option>
//               <option value="Beginner">Beginner</option>
//               <option value="Intermediate">Intermediate</option>
//               <option value="Advanced">Advanced</option>
//             </select>

//           </div>
//           <button
//             onClick={createCourse}
//             className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
//           >
//             Create
//           </button>
//         </div>
//       )}

//       {/* Course List */}
//       <div className="grid gap-4">
//         {courses.length === 0 ? (
//           <p>No courses available.</p>
//         ) : (
//           courses.map((course) => (
//             <Link key={course._id} to={`/courses/${course._id}`}>
//               <div className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-gray-50 transition">
//                 <div>
//                   <h3 className="text-lg font-bold">{course.title}</h3>
//                   {course.category && <p className="text-sm text-gray-600">Category: {course.category}</p>}
//                   {course.difficulty && (
//                     <p className="text-sm text-gray-600">Difficulty: {course.difficulty}</p>
//                   )}
//                   {course.activeLearners !== undefined && (
//                     <p className="text-sm text-gray-500">👨‍🎓 Active Learners: {course.activeLearners}</p>
//                   )}
//                 </div>
//                 {user?.role === 'Admin' ? (
//                   <button
//                     onClick={(e) => {
//                       e.preventDefault(); // prevent navigating when clicking delete
//                       deleteCourse(course._id);
//                     }}
//                     className="mt-3 md:mt-0 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                   >
//                     Delete
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => {
//                       if (isBlocked) {
//                         toast.warning('Complete or leave current course before joining a new one');
//                         return;
//                       }
//                       joinCourse(course._id);
//                     }}
//                     className={`
//     px-3 py-1 rounded text-sm transition 
//     ${isCurrentCourse
//                         ? isCompleted
//                           ? 'bg-green-500 text-white cursor-default'
//                           : 'bg-gray-400 text-white cursor-default'
//                         : 'bg-primary text-white hover:bg-blue-700'} 
//     ${isBlocked ? 'cursor-not-allowed' : ''}
//   `}
//                     title={
//                       isCurrentCourse
//                         ? isCompleted
//                           ? 'Course completed 🎉'
//                           : 'Already joined'
//                         : isBlocked
//                           ? 'Complete current course to join another'
//                           : 'Join this course'
//                     }
//                   >
//                     {isCurrentCourse
//                       ? isCompleted
//                         ? '✅ Completed'
//                         : 'Joined'
//                       : 'Join'}
//                   </button>

//                 )}
//               </div>
//             </Link>
//           ))
//         )}
//       </div>

//     </div>
//   ) });