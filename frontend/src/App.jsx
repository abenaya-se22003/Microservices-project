import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import RoomListing from './pages/RoomListing';
import BookingForm from './pages/BookingForm';
import Dashboard from './pages/admin/Dashboard';
import ManageRooms from './pages/admin/ManageRooms';
import ManageGuests from './pages/admin/ManageGuests';
import ManageReservations from './pages/admin/ManageReservations';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Flow */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<RoomListing />} />
          <Route path="/book/:roomId" element={<BookingForm />} />
        </Route>

        {/* Admin Flow */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="rooms" element={<ManageRooms />} />
          <Route path="guests" element={<ManageGuests />} />
          <Route path="reservations" element={<ManageReservations />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
