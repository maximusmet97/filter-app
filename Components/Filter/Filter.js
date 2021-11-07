import * as settings from "./settings.json";

const getColors = () => {
    let colors = [];

    settings.colors.forEach((color, index) => {
        colors.push(<option key={index} value={color}>{color}</option>);
    });

    return colors;
}

const getCategories = () => {
    let categories = [];

    settings.category.forEach((category, index) => {
        categories.push(<option key={index} value={category}>{category}</option>);
    });

    return categories;
}

const Filter = (props) => {

    const colors = getColors();
    const categories = getCategories();

    return (
        <form>
            <select 
                name="color" 
                id="color" 
                onChange={(e) => props.onFilter(e, "color")}>
                    {colors}
            </select>

            <select 
                name="category" 
                id="category" 
                onChange={(e) => props.onFilter(e, "category")}>
                    {categories}
            </select>
            
            <input 
                className="border"
                type="number" 
                name="minPrice"
                onChange={(e) => props.onFilter(e, "min")} 
                placeholder="Min Price" />


            <input 
                className="border"
                type="number" 
                name="maxPrice"
                onChange={(e) => props.onFilter(e, "max")} 
                placeholder="Max Price" />
        </form>
    );

}

export default Filter;