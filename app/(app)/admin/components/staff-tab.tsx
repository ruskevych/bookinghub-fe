import React, { useState } from 'react';
import { Staff, Booking } from '../types';
import { Avatar, AvatarImage, AvatarFallback } from '@/registry/new-york-v4/ui/avatar';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Star, Calendar, Award, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/new-york-v4/ui/select';
import { TabContentLayout } from '@/components/layouts/TabContentLayout';

interface StaffTabProps {
  staff: Staff[];
  bookings: Booking[];
}

// Utility for deep cloning
const deepClone = (obj: any) => JSON.parse(JSON.stringify(obj));

export const StaffTab: React.FC<StaffTabProps> = ({ staff, bookings }) => {
  // Assignment state: bookingId -> staffId
  const [assignments, setAssignments] = useState<{ [bookingId: string]: string }>({});
  // Local state for editable schedules
  const [editSchedules, setEditSchedules] = useState<{ [staffId: string]: boolean }>({});
  const [localStaff, setLocalStaff] = useState<Staff[]>(deepClone(staff));

  // Handle assignment
  const handleAssign = (bookingId: string, staffId: string) => {
    setAssignments((prev) => ({ ...prev, [bookingId]: staffId }));
  };

  // Handle schedule edit toggle
  const toggleEditSchedule = (staffId: string) => {
    setEditSchedules((prev) => ({ ...prev, [staffId]: !prev[staffId] }));
  };

  // Handle schedule change
  const handleScheduleChange = (staffId: string, idx: number, field: 'day' | 'start_time' | 'end_time', value: string) => {
    setLocalStaff((prev) =>
      prev.map((member) => {
        if (member.id === staffId) {
          const newAvail = [...member.availability];
          newAvail[idx] = { ...newAvail[idx], [field]: value };
          return { ...member, availability: newAvail };
        }
        return member;
      })
    );
  };

  return (
    <TabContentLayout title="Staff Management">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {localStaff.map((member) => (
          <Card key={member.id}>
            <CardHeader className="flex flex-col items-center pb-0">
              <Avatar className="w-20 h-20 mb-2 border-2 border-primary">
                <AvatarImage src={member.photo_url || '/default-avatar.png'} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg font-bold text-center">{member.name}</CardTitle>
              <CardDescription className="text-primary font-semibold text-center">{member.role}</CardDescription>
              <div className="text-xs text-muted-foreground text-center">{member.email}<br />{member.phone}</div>
            </CardHeader>
            <CardContent className="pt-2 pb-4">
              <div className="mb-3">
                <span className="font-semibold flex items-center gap-1">
                  <Award className="w-4 h-4 text-primary" />Specialties:
                </span>
                <span className="ml-6">{member.specialties.join(', ')}</span>
              </div>
              <div className="mb-3">
                <span className="font-semibold flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-primary" />Availability / Schedule:
                  <Button
                    variant="outline" 
                    size="sm"
                    className="ml-2 h-6 text-xs text-primary"
                    onClick={() => toggleEditSchedule(member.id)}
                  >
                    {editSchedules[member.id] ? 'Save' : 'Edit'}
                  </Button>
                </span>
                <ul className="list-disc ml-6 mt-1">
                  {member.availability.map((slot, idx) =>
                    editSchedules[member.id] ? (
                      <li key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          className="border rounded px-1 w-20 text-xs focus:border-primary focus:ring-1 focus:ring-primary"
                          value={slot.day}
                          onChange={e => handleScheduleChange(member.id, idx, 'day', e.target.value)}
                        />:
                        <input
                          type="time"
                          className="border rounded px-1 w-20 text-xs focus:border-primary focus:ring-1 focus:ring-primary"
                          value={slot.start_time}
                          onChange={e => handleScheduleChange(member.id, idx, 'start_time', e.target.value)}
                        />-
                        <input
                          type="time"
                          className="border rounded px-1 w-20 text-xs focus:border-primary focus:ring-1 focus:ring-primary"
                          value={slot.end_time}
                          onChange={e => handleScheduleChange(member.id, idx, 'end_time', e.target.value)}
                        />
                      </li>
                    ) : (
                      <li key={idx}>{slot.day}: {slot.start_time} - {slot.end_time}</li>
                    )
                  )}
                </ul>
              </div>
              <div className="mb-3">
                <span className="font-semibold flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />Performance:
                </span>
                <ul className="ml-6 mt-1">
                  <li>Bookings: <span className="font-semibold text-primary">{member.performance.bookings_handled}</span></li>
                  <li>Avg. Rating: <span className="font-semibold text-yellow-400 flex items-center gap-1">{member.performance.avg_rating} <Star className="w-3 h-3 inline-block" /> ({member.performance.total_ratings} ratings)</span></li>
                </ul>
              </div>
              {member.bio && <p className="mt-2 italic text-xs text-center text-muted-foreground">{member.bio}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Assign Bookings to Staff
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left font-medium">Booking</th>
                <th className="py-3 px-4 text-left font-medium">Current Staff</th>
                <th className="py-3 px-4 text-left font-medium">Assign To</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <span className="font-semibold">{booking.service_name}</span>
                    <br />
                    <span className="text-xs text-muted-foreground">{booking.start_time} - {booking.end_time}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {assignments[booking.id]
                      ? localStaff.find((s) => s.id === assignments[booking.id])?.name || '-' 
                      : '-'}
                  </td>
                  <td className="py-3 px-4">
                    <Select
                      value={assignments[booking.id] || ''}
                      onValueChange={(value) => handleAssign(booking.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff" />
                      </SelectTrigger>
                      <SelectContent>
                        {localStaff.map((member) => (
                          <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </CardContent>
        </Card>
      </div>
    </TabContentLayout>
  );
};
