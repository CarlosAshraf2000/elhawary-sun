import { Component } from "react";
import { translate } from "../../i18n";

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error("ErrorBoundary caught:", error, info);
    }

    render() {
        if (this.state.hasError) {
            const lang = document.documentElement.lang || "ar";
            return (
                <div className="min-h-[40vh] flex items-center justify-center px-6 py-16">
                    <div className="max-w-md text-center bg-white rounded-card shadow-card p-8">
                        <h2 className="text-2xl font-bold text-dark mb-3">
                            {translate(lang, "common.errorTitle")}
                        </h2>
                        <p className="text-gray-600 mb-6">{translate(lang, "common.errorMessage")}</p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="bg-gold text-black px-6 py-3 rounded-btn font-bold hover:bg-goldDark transition"
                        >
                            {translate(lang, "common.reloadPage")}
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
