import * as Yup from 'yup';

import Categories from '../models/Categories';

class CategoriesController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ erro: 'Os campos não estão válidos!' });
    }

    const { id } = await Categories.create(req.body);

    const category = await Categories.findByPk(id, {
      attributes: ['id', 'name'],
    });

    return res.status(201).json(category);
  }
}

export default new CategoriesController();
