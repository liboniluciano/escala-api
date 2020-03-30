import * as Yup from 'yup';

import { DatabaseError } from 'sequelize/types';
import Categories from '../models/Categories';

class CategoriesController {
  async index(req, res) {
    const idCategory = req.params.id;

    if (idCategory) {
      const category = await Categories.findOne({
        where: { id: idCategory, disabled_at: null },
        attributes: ['id', 'name'],
      });

      if (!category) {
        return res
          .status(404)
          .json({ message: 'Esta categoria não existe ou está desativada!' });
      }

      return res.json(category);
    }
    const categories = await Categories.findAll({
      where: { disabled_at: null },
      attributes: ['id', 'name'],
    });

    return res.json(categories);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ erro: 'Os campos não estão válidos!' });
    }

    const { id, name } = await Categories.create(req.body);

    return res.status(201).json({ id, name });
  }

  async update(req, res) {
    const idCategory = req.params.id;
    const schema = Yup.object().shape({
      name: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ erro: 'Os campos não estão válidos!' });
    }

    const category = await Categories.findOne({
      where: { id: idCategory, disabled_at: null },
    });

    if (!category) {
      return res
        .status(404)
        .json({ message: 'Esta categoria não existe ou foi desativada' });
    }

    const { id, name } = await Categories.update(req.body);

    return res.json({ id, name });
  }

  async delete(req, res) {
    const idCategory = req.params.id;
    const category = await Categories.findOne({
      where: { id: idCategory, disabled_at: null },
    });

    if (!category) {
      return res
        .status(404)
        .json({ message: 'Esta categoria não existe ou foi desativada' });
    }

    await category.update({ disabled_at: new Date() });

    return res.send();
  }
}

export default new CategoriesController();
