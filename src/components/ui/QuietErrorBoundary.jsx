import { Component } from "react";

/** Catches render errors in optional UI (e.g. carousel, 3D) without breaking the page. */
export default class QuietErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error("QuietErrorBoundary caught:", error, info);
    }

    render() {
        if (this.state.hasError) return null;
        return this.props.children;
    }
}
