import { Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { useLocale } from "../../hooks/useLocale";
import { CATEGORY_IDS } from "../../data/productDefaults";
import NavDropdown from "./NavDropdown";

export default function ProductsMegaMenu({ linkClass }) {
    const { t } = useLocale();

    return (
        <NavDropdown
            trigger={
                <button
                    type="button"
                    className={`flex items-center gap-1 ${linkClass("/products")}`}
                    aria-haspopup="true"
                >
                    {t("nav.products")}
                    <FaChevronDown className="text-xs" />
                </button>
            }
        >
            <ul className="py-1">
                <li>
                    <Link
                        to="/products"
                        className="block px-4 py-2.5 text-gray-800 hover:bg-gold/20 hover:text-dark transition"
                        role="menuitem"
                    >
                        {t("categories.all")}
                    </Link>
                </li>
                {CATEGORY_IDS.map((id) => (
                    <li key={id}>
                        <Link
                            to={`/products?category=${id}`}
                            className="block px-4 py-2.5 text-gray-800 hover:bg-gold/20 hover:text-dark transition text-sm"
                            role="menuitem"
                        >
                            {t(`categories.${id}`)}
                        </Link>
                    </li>
                ))}
            </ul>
        </NavDropdown>
    );
}
