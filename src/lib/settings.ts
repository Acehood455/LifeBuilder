export const ITEM_PER_PAGE = 10;

type RouteAccessMap = {
    [key: string]: string[];
};

export const routeAccessMap : RouteAccessMap = {
    '/admin(.*)' : ['admin'],
    '/student(.*)' : ['student'],
    '/teacher(.*)' : ['teacher'],
    '/parent(.*)' : ['parent'],
    '/list/teachers' : ['admin', 'teacher'],
    '/list/students' : ['admin', 'teacher'],
    '/list/parents' : ['admin', 'teacher'],
    '/list/subjects' : ['admin'],
    '/list/classes' : ['admin', 'teacher'],
    // '/list/exams' : ['admin', 'teacher', 'student', 'parent'],
    // '/list/assignments' : ['admin', 'teacher', 'student', 'parent'],
    '/list/assessments' : ['admin', 'teacher', ],
    '/list/results' : ['admin', 'teacher', 'student', 'parent'],
    // '/list/attendance' : ['admin', 'teacher', 'student', 'parent'],
    '/list/events' : ['admin', 'teacher', 'student', 'parent'],
    '/list/announcements' : ['admin', 'teacher', 'student', 'parent'],
    "/api/assessments/:assessmentId/results" : ['admin', 'teacher'],
    "/list/results/:studentId" : ['admin', 'teacher', 'student', 'parent']
}

export const appConfig = {
  currentYear: "2024/2025",
  currentTerm: "First Term", // First Term | Second Term | Third Term
  currentTermId : 1, // 1 | 2 | 3
  showFullYearResults: false, // true | false
  newTermBegins: "08/09/2025",
};