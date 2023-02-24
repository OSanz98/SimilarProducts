import React from 'react';
import Directory from '../../components/directory/directory.component';
import categories from '../../constants/data/category-data';

const HomeRoute = () => {
    return(
        <Directory categories={categories} />
    );
};

export default HomeRoute;