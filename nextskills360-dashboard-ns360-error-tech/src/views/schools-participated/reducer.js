export const initialData = {
    schools: 0,
    scans: 0,
    points: 0,
    appSupportTickets: 0,
    whatsappSupportTickets: 0,
    studentsRegistered: 0,
    teachersRegistered: 0,
    studentUsed: 0,
    teachersUsed: 0,
    studentsParticipated: 0,
    teachersParticipated: 0
};

export const reducer = (state, action) => {
    switch (action.type) {
        case 'updateCount':
            return { ...state, ...action.data };
        default:
            return state;
    }
};
