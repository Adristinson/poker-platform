import React, { useState, useRef } from 'react';
import { Upload, Download, Filter, Calendar, Building, DollarSign, User, Check, X, FileText, LogIn, LogOut } from 'lucide-react';

const PokerHistoryPlatform = () => {
  const [activeTab, setActiveTab] = useState('biblioteca');
  const [userRole, setUserRole] = useState('guest'); // 'guest', 'student', 'instructor'
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [showLogin, setShowLogin] = useState(false);
  
  const [curatedHistories, setCuratedHistories] = useState([
    {
      id: 1,
      filename: 'session_2024_01_15.txt',
      date: '2024-01-15',
      room: 'PokerStars',
      stakes: 'NL10',
      uploadDate: '2024-01-16',
      size: '45 KB'
    },
    {
      id: 2,
      filename: 'tournament_sunday_million.txt',
      date: '2024-01-14',
      room: '888poker',
      stakes: 'NL100',
      uploadDate: '2024-01-15',
      size: '128 KB'
    }
  ]);
  
  const [studentSubmissions, setStudentSubmissions] = useState([
    {
      id: 1,
      filename: 'my_session_jan10.txt',
      studentName: 'Carlos Rodriguez',
      date: '2024-01-10',
      room: 'PokerStars',
      stakes: 'NL25',
      submitDate: '2024-01-11',
      size: '67 KB',
      status: 'pending'
    },
    {
      id: 2,
      filename: 'bad_beat_session.txt',
      studentName: 'Ana Martinez',
      date: '2024-01-12',
      room: 'PartyPoker',
      stakes: 'NL10',
      submitDate: '2024-01-13',
      size: '34 KB',
      status: 'pending'
    }
  ]);

  const [filters, setFilters] = useState({
    room: '',
    stakes: '',
    dateFrom: '',
    dateTo: ''
  });

  const fileInputRef = useRef(null);
  const studentFileInputRef = useRef(null);

  const [newHistoryForm, setNewHistoryForm] = useState({
    date: '',
    room: '',
    stakes: ''
  });

  const [newStudentForm, setNewStudentForm] = useState({
    studentName: '',
    date: '',
    room: '',
    stakes: ''
  });

  // Simple authentication system
  const credentials = {
    instructor: { username: 'instructor', password: 'admin123' },
    students: [
      { username: 'carlos', password: 'student123' },
      { username: 'ana', password: 'student123' },
      { username: 'miguel', password: 'student123' }
    ]
  };

  const handleLogin = () => {
    const { username, password } = loginForm;
    
    if (username === credentials.instructor.username && password === credentials.instructor.password) {
      setUserRole('instructor');
      setShowLogin(false);
      setLoginForm({ username: '', password: '' });
    } else {
      const student = credentials.students.find(s => s.username === username && s.password === password);
      if (student) {
        setUserRole('student');
        setShowLogin(false);
        setLoginForm({ username: '', password: '' });
      } else {
        alert('Credenciales incorrectas');
      }
    }
  };

  const handleLogout = () => {
    setUserRole('guest');
    setActiveTab('biblioteca');
  };

  const rooms = ['PokerStars', '888poker', 'PartyPoker', 'GGPoker', 'WPN', 'Chico', 'Ipoker', 'Winamax', 'WPT', 'Otro'];
  const stakesOptions = ['NL10', 'NL25', 'NL50', 'NL100', 'NL200', 'NL500', 'NL1000', 'NL2000', 'NL5000', 'Otro'];

  const handleFileUpload = (event, isStudent = false) => {
    const file = event.target.files[0];
    if (!file) return;

    const form = isStudent ? newStudentForm : newHistoryForm;
    const setForm = isStudent ? setNewStudentForm : setNewHistoryForm;

    if (!form.date || !form.room || !form.stakes) {
      alert('Por favor completa todos los campos antes de subir el archivo');
      return;
    }

    if (isStudent && !form.studentName) {
      alert('Por favor ingresa tu nombre');
      return;
    }

    const newEntry = {
      id: Date.now(),
      filename: file.name,
      date: form.date,
      room: form.room,
      stakes: form.stakes,
      size: `${Math.round(file.size / 1024)} KB`,
      uploadDate: new Date().toISOString().split('T')[0]
    };

    if (isStudent) {
      newEntry.studentName = form.studentName;
      newEntry.submitDate = newEntry.uploadDate;
      newEntry.status = 'pending';
      setStudentSubmissions(prev => [...prev, newEntry]);
      setNewStudentForm({
        studentName: '',
        date: '',
        room: '',
        stakes: ''
      });
    } else {
      setCuratedHistories(prev => [...prev, newEntry]);
      setNewHistoryForm({
        date: '',
        room: '',
        stakes: ''
      });
    }

    // Reset file input
    if (isStudent) {
      studentFileInputRef.current.value = '';
    } else {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = (filename) => {
    // Simulate download
    alert(`Descargando: ${filename}`);
  };

  const approveSubmission = (id) => {
    const submission = studentSubmissions.find(s => s.id === id);
    if (submission) {
      const approved = {
        ...submission,
        id: Date.now(),
        uploadDate: new Date().toISOString().split('T')[0]
      };
      delete approved.studentName;
      delete approved.submitDate;
      delete approved.status;
      
      setCuratedHistories(prev => [...prev, approved]);
      setStudentSubmissions(prev => prev.filter(s => s.id !== id));
    }
  };

  const rejectSubmission = (id) => {
    setStudentSubmissions(prev => prev.filter(s => s.id !== id));
  };

  const filteredHistories = curatedHistories.filter(history => {
    return (!filters.room || history.room === filters.room) &&
           (!filters.stakes || history.stakes === filters.stakes) &&
           (!filters.dateFrom || history.date >= filters.dateFrom) &&
           (!filters.dateTo || history.date <= filters.dateTo);
  });

  // Login Modal Component
  const LoginModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Iniciar Sesión</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <input
              type="text"
              value={loginForm.username}
              onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre de usuario"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Contraseña"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <div className="text-xs text-gray-500">
            <p><strong>Instructor:</strong> usuario: instructor, contraseña: admin123</p>
            <p><strong>Estudiantes:</strong> carlos/ana/miguel, contraseña: student123</p>
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => setShowLogin(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-8 h-8 text-blue-600" />
                Plataforma de Historiales de Póker
              </h1>
              <p className="text-gray-600 mt-1">Gestión de historiales para la escuela de póker</p>
            </div>
            <div className="flex items-center space-x-4">
              {userRole === 'guest' ? (
                <button
                  onClick={() => setShowLogin(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <LogIn className="w-4 h-4" />
                  Iniciar Sesión
                </button>
              ) : (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {userRole === 'instructor' ? '👨‍🏫 Instructor' : '👨‍🎓 Estudiante'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-1 text-gray-600 hover:text-gray-800"
                  >
                    <LogOut className="w-4 h-4" />
                    Salir
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('biblioteca')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'biblioteca'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📚 Biblioteca del Instructor
            </button>
            {(userRole === 'student' || userRole === 'instructor') && (
              <button
                onClick={() => setActiveTab('estudiantes')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'estudiantes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📤 {userRole === 'instructor' ? `Envíos de Estudiantes (${studentSubmissions.length})` : 'Subir Historial'}
              </button>
            )}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'biblioteca' && (
          <div className="space-y-6">
            {/* Upload Form - Only for instructors */}
            {userRole === 'instructor' && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Subir Nuevo Historial</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Fecha de la Sesión
                    </label>
                    <input
                      type="date"
                      value={newHistoryForm.date}
                      onChange={(e) => setNewHistoryForm({...newHistoryForm, date: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Building className="w-4 h-4 inline mr-1" />
                      Sala
                    </label>
                    <select
                      value={newHistoryForm.room}
                      onChange={(e) => setNewHistoryForm({...newHistoryForm, room: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Seleccionar sala</option>
                      {rooms.map(room => (
                        <option key={room} value={room}>{room}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Stakes
                    </label>
                    <select
                      value={newHistoryForm.stakes}
                      onChange={(e) => setNewHistoryForm({...newHistoryForm, stakes: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Seleccionar stakes</option>
                      {stakesOptions.map(stakes => (
                        <option key={stakes} value={stakes}>{stakes}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Archivo
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.csv,.log,.rar,.zip,.7z"
                      onChange={(e) => handleFileUpload(e, false)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtros
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  value={filters.room}
                  onChange={(e) => setFilters({...filters, room: e.target.value})}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Todas las salas</option>
                  {rooms.map(room => (
                    <option key={room} value={room}>{room}</option>
                  ))}
                </select>
                <select
                  value={filters.stakes}
                  onChange={(e) => setFilters({...filters, stakes: e.target.value})}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Todos los stakes</option>
                  {stakesOptions.map(stakes => (
                    <option key={stakes} value={stakes}>{stakes}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                  placeholder="Desde"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                  placeholder="Hasta"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Histories Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">
                  Historiales Disponibles ({filteredHistories.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Archivo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha Sesión
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sala
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stakes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tamaño
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredHistories.map((history) => (
                      <tr key={history.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{history.filename}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {history.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {history.room}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {history.stakes}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {history.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDownload(history.filename)}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          >
                            <Download className="w-4 h-4" />
                            Descargar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'estudiantes' && (userRole === 'student' || userRole === 'instructor') && (
          <div className="space-y-6">
            {/* Student Upload Form - For students and instructors */}
            {(userRole === 'student' || userRole === 'instructor') && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {userRole === 'student' ? 'Subir Historial' : 'Subir Historial (Estudiantes)'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <User className="w-4 h-4 inline mr-1" />
                      Tu Nombre
                    </label>
                    <input
                      type="text"
                      value={newStudentForm.studentName}
                      onChange={(e) => setNewStudentForm({...newStudentForm, studentName: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Fecha de la Sesión
                    </label>
                    <input
                      type="date"
                      value={newStudentForm.date}
                      onChange={(e) => setNewStudentForm({...newStudentForm, date: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Building className="w-4 h-4 inline mr-1" />
                      Sala
                    </label>
                    <select
                      value={newStudentForm.room}
                      onChange={(e) => setNewStudentForm({...newStudentForm, room: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Seleccionar sala</option>
                      {rooms.map(room => (
                        <option key={room} value={room}>{room}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Stakes
                    </label>
                    <select
                      value={newStudentForm.stakes}
                      onChange={(e) => setNewStudentForm({...newStudentForm, stakes: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Seleccionar stakes</option>
                      {stakesOptions.map(stakes => (
                        <option key={stakes} value={stakes}>{stakes}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Archivo
                    </label>
                    <input
                      ref={studentFileInputRef}
                      type="file"
                      accept=".txt,.csv,.log,.rar,.zip,.7z"
                      onChange={(e) => handleFileUpload(e, true)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Student Submissions Table - Only for instructors */}
            {userRole === 'instructor' && (
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-medium text-gray-900">
                    Envíos Pendientes de Revisión ({studentSubmissions.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estudiante
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Archivo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha Sesión
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sala
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stakes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {studentSubmissions.map((submission) => (
                        <tr key={submission.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{submission.studentName}</div>
                            <div className="text-sm text-gray-500">Enviado: {submission.submitDate}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{submission.filename}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {submission.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {submission.room}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {submission.stakes}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => approveSubmission(submission.id)}
                                className="text-green-600 hover:text-green-900 flex items-center gap-1"
                                title="Aprobar y mover a biblioteca"
                              >
                                <Check className="w-4 h-4" />
                                Aprobar
                              </button>
                              <button
                                onClick={() => rejectSubmission(submission.id)}
                                className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                title="Rechazar envío"
                              >
                                <X className="w-4 h-4" />
                                Rechazar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {studentSubmissions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No hay envíos pendientes de revisión
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Login Modal */}
      {showLogin && <LoginModal />}
    </div>
  );
};

export default PokerHistoryPlatform;
