import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useClasses, useParents, useStudents } from "@/hooks/useApi";
import { BookOpen, GraduationCap, Loader2, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { data: students, isLoading: studentsLoading } = useStudents();
  const { data: parents, isLoading: parentsLoading } = useParents();
  const { data: classes, isLoading: classesLoading } = useClasses();

  const isLoading = studentsLoading || parentsLoading || classesLoading;

  // Map day number (0-6) to day labels
  // 0 = Sunday, 1 = Monday, 2 = Tuesday, ..., 6 = Saturday
  const dayNumberToLabel: Record<number, string> = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };

  // Format time from "HH:mm:ss" to "HH:mm"
  const formatTime = (time: string): string => {
    if (!time) return "";
    if (time.length === 5) return time;
    if (time.length === 8) return time.substring(0, 5);
    return time;
  };

  // Get day of week label
  const getDayLabel = (dayOfWeek: number | string): string => {
    if (typeof dayOfWeek === 'string') return dayOfWeek;
    return dayNumberToLabel[dayOfWeek] || 'Unknown';
  };

  // Get time slot from startTime and endTime
  const getTimeSlot = (classItem: any): string => {
    if (classItem.timeSlot) return classItem.timeSlot;
    if (classItem.startTime && classItem.endTime) {
      const start = formatTime(classItem.startTime);
      const end = formatTime(classItem.endTime);
      return `${start} - ${end}`;
    }
    return 'N/A';
  };

  const totalStudents = students?.length || 0;
  const totalParents = parents?.length || 0;
  const totalClasses = classes?.length || 0;
  const fullClasses = classes?.filter(cls => cls.full).length || 0;
  const availableClasses = totalClasses - fullClasses;

  const stats = [
    {
      title: "Total Students",
      value: totalStudents,
      icon: Users,
      description: "Registered students",
      color: "from-blue-500/20 to-blue-500/5",
      iconColor: "text-blue-600",
      link: "/students"
    },
    {
      title: "Parents",
      value: totalParents,
      icon: GraduationCap,
      description: "Registered parents",
      color: "from-purple-500/20 to-purple-500/5",
      iconColor: "text-purple-600",
      link: "/parents"
    },
    {
      title: "Active Classes",
      value: totalClasses,
      icon: BookOpen,
      description: "Running classes",
      color: "from-green-500/20 to-green-500/5",
      iconColor: "text-green-600",
      link: "/classes"
    },
    {
      title: "Available Slots",
      value: availableClasses,
      icon: TrendingUp,
      description: "Classes with spots",
      color: "from-orange-500/20 to-orange-500/5",
      iconColor: "text-orange-600",
      link: "/classes"
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header with Welcome Message */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 md:p-8 border border-primary/20">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">Welcome Back</h1>
        <p className="text-muted-foreground text-sm md:text-lg">TeenUp Learning Management System</p>
        <p className="text-muted-foreground mt-2 text-xs md:text-base">Here's what's happening with your classes today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} to={stat.link}>
              <Card className={`border-2 border-transparent hover:border-primary/50 bg-gradient-to-br ${stat.color} cursor-pointer transition-all duration-300 hover:shadow-lg`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                      <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                    </div>
                    <div className={`p-2 rounded-lg bg-white/50`}>
                      <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Overview Section */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Recent Students */}
        <Card className="border-2 border-primary/10 hover:border-primary/30 transition-colors">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Recent Students
            </CardTitle>
            <CardDescription>Latest registrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {students && students.length > 0 ? (
              students?.slice(0, 5).map((student, index) => (
                <Link key={student.id} to={`/students/${student.id}`} className="block group">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {String(index + 1)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground group-hover:text-primary truncate">{student.name}</p>
                          <p className="text-xs text-muted-foreground">Grade {student.currentGrade}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground flex-shrink-0 ml-2 hidden sm:block">
                      {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No students found</p>
            )}
            <Link to="/students">
              <Button variant="outline" className="w-full mt-2">View All Students</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Classes Overview */}
        <Card className="border-2 border-primary/10 hover:border-primary/30 transition-colors">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              Classes Overview
            </CardTitle>
            <CardDescription>Current status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {classes && classes.length > 0 ? (
              classes?.slice(0, 5).map((classItem, index) => (
                <Link key={classItem.id} to={`/classes/${classItem.id}`} className="block group">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {String(index + 1)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground group-hover:text-primary truncate">{classItem.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{getDayLabel(classItem.dayOfWeek)} • {getTimeSlot(classItem)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2 hidden sm:block">
                      <div className="text-xs font-semibold">
                        {classItem.maxStudents}
                      </div>
                      <div className={`text-xs px-2 py-0.5 rounded-full ${classItem.full ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                        {classItem.full ? "Full" : "Available"}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No classes found</p>
            )}
            <Link to="/classes">
              <Button variant="outline" className="w-full mt-2">View All Classes</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
