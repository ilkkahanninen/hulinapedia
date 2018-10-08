import * as React from 'react'
import { Link } from 'react-static'

interface Props {
  categories: string[]
}

export const Categories = ({ categories }: Props) => (
  <div className="categories">
    {categories.map(category => (
      <Link key={category} to={`/kategoriat#${category}`}>
        {category}
      </Link>
    ))}
  </div>
)
