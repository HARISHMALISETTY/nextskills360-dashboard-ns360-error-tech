import { React, lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from './ProtectedRoute';
import { roles } from '../constants/roles';

// dashboard routing
const Projects = Loadable(lazy(() => import('views/projects')));
const Reports = Loadable(lazy(() => import('views/reports')));
const ParticipatedSchools = Loadable(lazy(() => import('views/schools-participated')));
const SchoolDetails = Loadable(lazy(() => import('views/school-details')));
const StudentsList = Loadable(lazy(() => import('views/students-list')));
const TeachersList = Loadable(lazy(() => import('views/teachers-list')));
const WorldGallery = Loadable(lazy(() => import('views/world-gallery')));
const ReportsSettings = Loadable(lazy(() => import('views/admin-settings')));
const SchoolCharts = Loadable(lazy(() => import('views/school-details/charts')));
const ClassCharts = Loadable(lazy(() => import('views/teacher-student-reports/charts')));
const SharedPost = Loadable(lazy(() => import('views/world-gallery/sharedPost')));

// utilities routing

// ==============================|| MAIN ROUTING ||============================== //

const allRoles = Object.values(roles);

const MainRoutes = {
    path: '/',
    element: (
        <ProtectedRoute roles={allRoles}>
            <MainLayout />
        </ProtectedRoute>
    ),
    children: [
        {
            path: '/',
            element: (
                <ProtectedRoute roles={allRoles}>
                    <Projects />
                </ProtectedRoute>
            )
        },
        // {
        //     path: 'projects',
        //     element: (
        //         <ProtectedRoute roles={[roles.ADMIN, roles.PROGRAM_HEAD, roles.GUEST_PROGRAM_HEAD, roles.PRINCIPAL, roles.GUEST_PRINCIPAL]}>
        //             <Projects />
        //         </ProtectedRoute>
        //     )
        // },
        {
            path: 'reports/:projectId',
            children: [
                {
                    index: true,
                    element: (
                        <ProtectedRoute roles={[roles.ADMIN, roles.PROGRAM_HEAD, roles.GUEST_PROGRAM_HEAD]}>
                            <Reports />
                        </ProtectedRoute>
                    )
                },
                {
                    path: 'participated-schools/:schoolsCount',
                    element: (
                        <ProtectedRoute roles={[roles.ADMIN, roles.PROGRAM_HEAD, roles.GUEST_PROGRAM_HEAD]}>
                            <ParticipatedSchools />
                        </ProtectedRoute>
                    )
                },
                {
                    path: 'school-details/:schoolId',
                    children: [
                        {
                            index: true,
                            element: (
                                <ProtectedRoute
                                    roles={[
                                        roles.ADMIN,
                                        roles.PROGRAM_HEAD,
                                        roles.GUEST_PROGRAM_HEAD,
                                        roles.PRINCIPAL,
                                        roles.GUEST_PRINCIPAL
                                    ]}
                                >
                                    <SchoolDetails />
                                </ProtectedRoute>
                            )
                        },
                        {
                            path: 'world-gallery',
                            element: (
                                <ProtectedRoute roles={[roles.PRINCIPAL, roles.GUEST_PRINCIPAL]}>
                                    <WorldGallery />
                                </ProtectedRoute>
                            )
                        }
                    ]
                },
                {
                    path: 'school-reports/:schoolId',
                    element: (
                        <ProtectedRoute
                            roles={[roles.ADMIN, roles.PROGRAM_HEAD, roles.GUEST_PROGRAM_HEAD, roles.PRINCIPAL, roles.GUEST_PRINCIPAL]}
                        >
                            <SchoolCharts />
                        </ProtectedRoute>
                    )
                },

                {
                    path: 'students-list/:schoolId/class/:classId',
                    element: (
                        <ProtectedRoute roles={allRoles}>
                            <StudentsList />
                        </ProtectedRoute>
                    )
                },
                {
                    path: 'teachers-list/:schoolId/class/:classId',
                    element: (
                        <ProtectedRoute roles={allRoles}>
                            <TeachersList />
                        </ProtectedRoute>
                    )
                },
                {
                    path: 'world-gallery',
                    element: (
                        <ProtectedRoute
                            roles={[roles.ADMIN, roles.PROGRAM_HEAD, roles.GUEST_PROGRAM_HEAD, roles.PRINCIPAL, roles.GUEST_PRINCIPAL]}
                        >
                            <WorldGallery />
                        </ProtectedRoute>
                    )
                },
                {
                    path: 'settings',
                    element: (
                        <ProtectedRoute roles={[roles.ADMIN]}>
                            <ReportsSettings />
                        </ProtectedRoute>
                    )
                }
            ]
        },
        {
            path: 'class-reports/:classId',
            element: (
                <ProtectedRoute roles={[roles.TEACHER, roles.STUDENT]}>
                    <ClassCharts />
                </ProtectedRoute>
            )
        },
        {
            path: 'world-gallery',
            children: [
                {
                    index: true,
                    element: (
                        <ProtectedRoute
                            roles={[roles.ADMIN, roles.PROGRAM_HEAD, roles.GUEST_PROGRAM_HEAD, roles.PRINCIPAL, roles.GUEST_PRINCIPAL]}
                        >
                            <WorldGallery />
                        </ProtectedRoute>
                    )
                },
                {
                    path: ':projectId',
                    element: (
                        <ProtectedRoute roles={[roles.TEACHER, roles.STUDENT]}>
                            <WorldGallery />
                        </ProtectedRoute>
                    )
                }
            ]
        },
        {
            path: 'shared/post/:postId',
            element: (
                <ProtectedRoute roles={allRoles}>
                    <SharedPost />
                </ProtectedRoute>
            )
        }
    ]
};

export default MainRoutes;
