import PropTypes from 'prop-types';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { getProjectDataById } from 'services/project-queries';
import Logo from 'ui-component/Logo';

// ==============================|| Side Menu Sponsor LOGO's ||============================== //

const LogoSection = ({ projectId }) => {
    const [projectData, loading] = useDocumentData(getProjectDataById(projectId));
    return (
        !loading && (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px'
                }}
            >
                {projectData?.project_sponsor_logo ? <Logo url={projectData?.project_sponsor_logo} /> : null}
                {projectData?.project_implementing_partner_logo ? <Logo url={projectData?.project_implementing_partner_logo} /> : null}
                {projectData?.company_logo ? <Logo url={projectData?.company_logo} /> : null}
            </div>
        )
    );
};

LogoSection.propTypes = {
    projectId: PropTypes.string.isRequired
};
export default LogoSection;
