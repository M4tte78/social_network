// src/hooks/useRedirect.js
import { useNavigate } from 'react-router-dom';

const useRedirect = () => {
    const navigate = useNavigate();
    return (path) => {
        navigate(path);
    };
};

export default useRedirect;
