import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Collapse, Container, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem }
  from 'reactstrap'
import { canManageUsers } from 'helpers/roleHelpers'
import { logout } from 'redux/modules/auth'

class Header extends React.Component {
  static propTypes = {
    auth: PropTypes.object,
    logout: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = {
      isOpen: false
    }
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  handleLogout = (e) => {
    const { logout } = this.props
    logout()
  }

  render() {
    const { auth } = this.props

    return (
      <div>
        <Navbar color="inverse" inverse toggleable>
          <NavbarToggler right onClick={this.toggle} />
          <NavbarBrand href="/">Jogging Tracker</NavbarBrand>
          <Collapse isOpen={this.state.isOpen} navbar>
            {auth.me
            ? <Nav className="ml-auto" navbar>
              <NavItem>
                <Link to='/dashboard' className='nav-link'>Dashboard</Link>
              </NavItem>
              {canManageUsers(auth.me) && <NavItem>
                <Link to='/users' className='nav-link'>Users</Link>
              </NavItem>}
              <NavItem>
                <Link to='/records' className='nav-link'>Records</Link>
              </NavItem>
              <NavItem>
                <Link to='/profile' className='nav-link'>Profile</Link>
              </NavItem>
              <NavItem>
                <Link to='/' onClick={this.handleLogout} className='nav-link'>Logout</Link>
              </NavItem>
            </Nav>
            : <Nav className="ml-auto" navbar>
              <NavItem>
                <Link to='/login' className='nav-link'>Login</Link>
              </NavItem>
              <NavItem>
                <Link to='/signup' className='nav-link'>Sign up</Link>
              </NavItem>
            </Nav>}
          </Collapse>
        </Navbar>
        {auth.me && <Container fluid className='text-right mt-2 mb-2'>
          Welcome <strong>{auth.me.first_name} {auth.me.last_name}</strong>!
        </Container>}
      </div>
    )
  }
}

const selector = (state) => ({
  auth: state.auth
})

const actions = {
  logout
}

export default connect(selector, actions)(Header)
