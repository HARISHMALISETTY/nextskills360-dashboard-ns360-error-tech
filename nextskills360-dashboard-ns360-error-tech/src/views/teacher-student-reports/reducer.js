export const initialData = {
    schools: '',
    scans: '',
    points: '',
    appSupportTickets: '',
    whatsappSupportTickets: '',
    studentsRegistered: '',
    teachersRegistered: '',
    studentUsed: '',
    teachersUsed: '',
    studentsParticipated: '',
    teachersParticipated: '',
    topThreeStudents: {
        1: {
            name: '',
            id: 1
        },
        2: {
            name: '',
            id: 2
        },
        3: {
            name: '',
            id: 3
        }
    },
    topThreeTeachers: {
        1: {
            name: '',
            id: 1
        },
        2: {
            name: '',
            id: 2
        },
        3: {
            name: '',
            id: 3
        }
    },
    classWiseData: {}
};

export const reducer = (state, action) => {
    switch (action.type) {
        case 'updateCount':
            return { ...state, ...action.data };
        default:
            return state;
    }
};
