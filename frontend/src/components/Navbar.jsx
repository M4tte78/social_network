import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

const NavigationBar = () => {
    const { user, logout } = useAuth();

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">🏋️ SportNetwork</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {user ? (
                            <>
                                <Nav.Link as={Link} to="/profile">Profil</Nav.Link>
                                <Nav.Link as={Link} to="/messages">Messages</Nav.Link>
                                {user.role === "admin" && (
                                    <Nav.Link as={Link} to="/admin" className="text-warning">Admin</Nav.Link>
                                )}
                                <Button variant="outline-danger" onClick={logout}>Déconnexion</Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Connexion</Nav.Link>
                                <Nav.Link as={Link} to="/register">Inscription</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
